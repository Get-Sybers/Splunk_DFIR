import sys
import os
from importlib import import_module

import cexc
from .base_util import is_valid_identifier
from .searchinfo_util import should_use_btool, validate_searchinfo_for_btool
from exec_anaconda import get_apps_path
from .scoring_loader import (
    ScoringLoader,
    BtoolScoringLoadingStrategy,
    RestScoringLoadingStrategy,
)

logger = cexc.get_logger(__name__)


def load_scorings_from_searchinfo(searchinfo):
    """Load the list of scorings supported from Splunk

    Args:
        searchinfo (dict): information required for search

    Returns:
        (dict): mapping of scoring name to a dict containing information about
        the scoring method (app, disabled, package, module, class)

    """
    if not searchinfo:
        return {}

    scoring_loader = scoring_loader_from_searchinfo(searchinfo)
    return scoring_loader.load_scorings()


def scoring_loader_from_searchinfo(searchinfo):
    """Create a ScoringLoader object with the correct scoring method loading
    strategy based on information from the searchinfo

    Args:
        searchinfo (dict): information required for search

    Returns:
        (ScoringLoader): ScoringLoader instance with the correct scoring method
            loading strategy

    """
    if should_use_btool(searchinfo):
        is_valid, err = validate_searchinfo_for_btool(searchinfo)
        if is_valid:
            # On an indexer, we need to iterate through the roles and merge the results manually
            # since btool does not have user-to-role mapping there. Pass the roles instead of the username.
            scoring_loader = ScoringLoader(BtoolScoringLoadingStrategy(searchinfo))
        else:
            raise RuntimeError('Failed to load scoring method on remote Splunk: {}'.format(err))
    else:
        # On a search head or a standalone node, REST API will get us the correctly merged results.
        scoring_loader = ScoringLoader(RestScoringLoadingStrategy(searchinfo))
    return scoring_loader


def get_scoring_stanza(scoring_name, searchinfo):
    """Gets the scoring_stanza corresponding to scoring_name from mlspl.conf

    Args:
        scoring_name (str): name of scoring method (eg. accuracy_score)
        searchinfo (dict): information required for search

    Returns:
        scoring_stanza (str): stanza corresponding to scoring_name in mlspl.conf
    """
    if not is_valid_identifier(scoring_name):
        raise RuntimeError(
            'Failed to load scoring method with an invalid name: {}'.format(scoring_name)
        )

    all_scorings = load_scorings_from_searchinfo(searchinfo)

    if scoring_name in all_scorings:
        scoring = all_scorings[scoring_name]
        scoring_stanza = 'score:{}'.format(scoring['subpackage'])
        return scoring_stanza
    else:
        raise RuntimeError('Scoring method "%s" cannot be loaded' % scoring_name)


def get_scoring_class_and_module(scoring_name, searchinfo):
    """Import and initialize the scoring.

    Args:
        scoring_name (str): the usual suspect
        searchinfo (dict): information required for search

    Returns:
        scoring_class (class): the suspect's class
        scoring_module_name (str): the suspect's module as in scorings.conf
    """

    if not is_valid_identifier(scoring_name):
        raise RuntimeError(
            'Failed to load scoring method with an invalid name: {}'.format(scoring_name)
        )

    all_scorings = load_scorings_from_searchinfo(searchinfo)

    scoring = {}
    try:
        scoring = all_scorings[scoring_name]
        if not scoring['disabled']:
            bundle_path = searchinfo.get('bundle_path')
            new_sys_path = os.path.join(get_apps_path(bundle_path), scoring['app'], 'bin')
            if new_sys_path not in sys.path:
                sys.path.append(new_sys_path)

            scoring_parent_package = scoring['package']
            scoring_subpackage_package = scoring['subpackage']
            scoring_module_name = scoring['module']
            scoring_class_name = scoring['class']
            module_path = '{}.{}.{}'.format(
                scoring_parent_package, scoring_subpackage_package, scoring_module_name
            )
            scoring_module = import_module(module_path)
        else:
            raise RuntimeError('Scoring method "%s" is disabled' % scoring_name)

        scoring_class = getattr(scoring_module, scoring_class_name)
        return scoring_class, scoring_module_name
    except (ImportError, AttributeError) as e:
        logger.debug(e)
        package_name = scoring.get('package', '')
        subpackage_name = scoring.get('subpackage', '')
        module_name = scoring.get('module', '')
        class_name = scoring.get('class', '')
        if package_name and module_name and class_name:
            scoring_name = '{}.{}.{}.{}'.format(
                package_name, subpackage_name, module_name, class_name
            )
        raise RuntimeError('Failed to load scoring method "{}"'.format(scoring_name))

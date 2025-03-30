# Supporting classes used in CARAnalytic

class CoverageItem:
    """
    Represents a technique coverage item in a CAR analytic.
    """
    def __init__(self):
        self.technique = ""
        self.subtechniques = []
        self.tactics = []
        self.coverage = ""

    @classmethod
    def from_dict(cls, data):
        item = cls()
        item.technique = data.get('technique', '')
        item.subtechniques = data.get('subtechniques', [])
        item.tactics = data.get('tactics', [])
        item.coverage = data.get('coverage', '')
        return item

    def to_dict(self):
        data = {
            'technique': self.technique,
            'tactics': self.tactics,
            'coverage': self.coverage
        }
        if self.subtechniques:
            data['subtechniques'] = self.subtechniques
        return data


class Implementation:
    """
    Represents an implementation section within a CAR analytic.
    """
    def __init__(self):
        self.name = ""
        self.description = ""
        self.code = ""
        self.data_model = ""
        self.type = ""

    @classmethod
    def from_dict(cls, data):
        impl = cls()
        impl.name = data.get('name', '')
        impl.description = data.get('description', '')
        impl.code = data.get('code', '')
        impl.data_model = data.get('data_model', '')
        impl.type = data.get('type', '')
        return impl

    def to_dict(self):
        data = {'type': self.type}
        if self.name:
            data['name'] = self.name
        if self.description:
            data['description'] = self.description
        if self.code:
            data['code'] = self.code
        if self.data_model:
            data['data_model'] = self.data_model
        return data


class UnitTest:
    """
    Represents a unit test defined in the analytic.
    """
    def __init__(self):
        self.configurations = []
        self.description = ""
        self.commands = []

    @classmethod
    def from_dict(cls, data):
        test = cls()
        test.configurations = data.get('configurations', [])
        test.description = data.get('description', '')
        test.commands = data.get('commands', [])
        return test

    def to_dict(self):
        data = {'description': self.description}
        if self.configurations:
            data['configurations'] = self.configurations
        if self.commands:
            data['commands'] = self.commands
        return data


class TruePositive:
    """
    Represents an observed true positive case supporting the analytic.
    """
    def __init__(self):
        self.source = ""
        self.description = ""
        self.event_snippet = ""
        self.full_event = ""

    @classmethod
    def from_dict(cls, data):
        tp = cls()
        tp.source = data.get('source', '')
        tp.description = data.get('description', '')
        tp.event_snippet = data.get('event_snippet', '')
        tp.full_event = data.get('full_event', '')
        return tp

    def to_dict(self):
        data = {'source': self.source}
        if self.description:
            data['description'] = self.description
        if self.event_snippet:
            data['event_snippet'] = self.event_snippet
        if self.full_event:
            data['full_event'] = self.full_event
        return data


class D3FendMapping:
    """
    Represents a D3FEND mapping for a CAR analytic.
    """
    def __init__(self):
        self.iri = ""
        self.id = ""
        self.label = ""

    @classmethod
    def from_dict(cls, data):
        mapping = cls()
        mapping.iri = data.get('iri', '')
        mapping.id = data.get('id', '')
        mapping.label = data.get('label', '')
        return mapping

    def to_dict(self):
        return {
            'iri': self.iri,
            'id': self.id,
            'label': self.label
        }


# Main composite class representing a full CAR analytic
class CARAnalytic:
    """
    Represents a full MITRE CAR (Cyber Analytics Repository) analytic.
    This class aggregates all related sections such as coverage, implementation,
    unit tests, true positives, references, and D3FEND mappings.
    """
    def __init__(self):
        # Metadata fields
        self.title = ""
        self.submission_date = ""
        self.update_date = ""
        self.information_domain = ""
        self.platforms = []
        self.subtypes = []
        self.analytic_types = []
        self.contributors = []
        self.id = ""
        self.description = ""

        # Nested structured content
        self.coverage = []
        self.implementations = []
        self.unit_tests = []
        self.true_positives = []
        self.data_model_references = []
        self.references = []
        self.d3fend_mappings = []

    @classmethod
    def from_dict(cls, data):
        """Create a CARAnalytic object from a dictionary."""
        analytic = cls()
        analytic.title = data.get('title', '')
        analytic.submission_date = data.get('submission_date', '')
        analytic.update_date = data.get('update_date', '')
        analytic.information_domain = data.get('information_domain', '')
        analytic.platforms = data.get('platforms', [])
        analytic.subtypes = data.get('subtypes', [])
        analytic.analytic_types = data.get('analytic_types', [])
        analytic.contributors = data.get('contributors', [])
        analytic.id = data.get('id', '')
        analytic.description = data.get('description', '')

        for item in data.get('coverage', []):
            analytic.coverage.append(CoverageItem.from_dict(item))

        for item in data.get('implementations', []):
            analytic.implementations.append(Implementation.from_dict(item))

        for item in data.get('unit_tests', []):
            analytic.unit_tests.append(UnitTest.from_dict(item))

        for item in data.get('true_positives', []):
            analytic.true_positives.append(TruePositive.from_dict(item))

        analytic.data_model_references = data.get('data_model_references', [])
        analytic.references = data.get('references', [])

        for item in data.get('d3fend_mappings', []):
            analytic.d3fend_mappings.append(D3FendMapping.from_dict(item))

        return analytic

    def to_dict(self):
        """Convert the CARAnalytic object back to a dictionary."""
        data = {
            'title': self.title,
            'submission_date': self.submission_date,
            'update_date': self.update_date,
            'information_domain': self.information_domain,
            'platforms': self.platforms,
            'subtypes': self.subtypes,
            'analytic_types': self.analytic_types,
            'contributors': self.contributors,
            'id': self.id,
            'description': self.description,
            'coverage': [item.to_dict() for item in self.coverage],
            'implementations': [item.to_dict() for item in self.implementations],
            'unit_tests': [item.to_dict() for item in self.unit_tests],
            'true_positives': [item.to_dict() for item in self.true_positives],
            'data_model_references': self.data_model_references,
            'references': self.references,
            'd3fend_mappings': [item.to_dict() for item in self.d3fend_mappings]
        }
        return data

    def __str__(self):
        """Human-readable string representation of the analytic."""
        return f"{self.id}: {self.title}"

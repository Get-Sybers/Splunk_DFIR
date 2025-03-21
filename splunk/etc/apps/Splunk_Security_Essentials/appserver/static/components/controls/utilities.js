'use strict';

/**
 * Fully decode URIComponent by a recursively way.
 * @param {string} uriComponent - The URI Component.
 * @return {string} uriComponent - The fully decoded URIComponent.
 */
function fullyDecodeURIComponent(uriComponent) {
    const isEncoded = function(uriComponent) {
        uriComponent = uriComponent || '';
        return uriComponent !== decodeURIComponent(uriComponent);
    }

    while (isEncoded(uriComponent)) {
        uriComponent = decodeURIComponent(uriComponent);
    }
    return uriComponent;
}
window.fullyDecodeURIComponent = fullyDecodeURIComponent;


/**
 * Edit action related to the Edit button - Popup the editing showcase page of the content and update the edited version.
 * Reference from: function editContent(obj) at custom_contents.js
 * @param {string} showcaseId - The showcaseID of the custom content.
 * @param {object} ShowcaseInfo - ShowcaseInfo Oject.
 * @param {object} summary - The custom content object. 
 * @param {boolean} isRefresh - Represents whether refresh the page after finish edit.
 */

// Deprecated function
function editCustomContent(showcaseId, ShowcaseInfo, summary, isRefresh = false) {
    // console.log("Popping for showcase", showcaseId);
    require([
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
        ),
    ], Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/components/controls/ProcessSummaryUI.js"
    ), function (_, ProcessSummaryUI) {
        customContentModal(function (showcaseId, summary) {
            // console.log("Successfully Edited", showcaseId, summary);
            // There's some processing that occurs in SSEShowcaseInfo and we want to get the full detail here.
            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/services/SSEShowcaseInfo?locale=" +
                    window.localeString +
                    "&bust=" +
                    Math.round(Math.random() * 20000000),
                async: true,
                success: function (returneddata) {
                    let summary = returneddata.summaries[showcaseId]
                    // summary.dashboard is component of the content's showcase page URL
                    summary.dashboard = fullyDecodeURIComponent(
                        summary.dashboard
                    )
                    ShowcaseInfo.summaries[showcaseId] = summary
                    ProcessSummaryUI.addItem_async($, summary)
                    // Force to refersh the page
                    if (isRefresh) {
                        setTimeout(() => {
                            location.reload()
                        }, 500)
                    }
                },
            })
        }, ShowcaseInfo.summaries[showcaseId])
    })
}
window.editCustomContent = editCustomContent;
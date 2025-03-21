require([
    "components/controls/Modal",
    "components/controls/utilities",
    "underscore",
    Splunk.util.make_full_url(
        "/static/app/Splunk_Security_Essentials/components/controls/ProcessSummaryUI.js"
    ),
], function (Modal, utilities, _, ProcessSummaryUI) {
    var addingIndividualContent = $.Deferred()
    var examples = {}
    loadSPL()

    function trigger_clicked(str) {
        if (document.getElementById("checkbox_" + str).checked) {
            window.NumSearchesSelected += 1
        } else {
            window.NumSearchesSelected -= 1
        }
        $("#NumSearches").text(window.NumSearchesSelected)
    }

    window.allDataSources = new Object()

    let selectedSummaryClone = localStorage.getItem(
        "sse-summarySelectedToClone"
    )
    let selectedSummaryEdit = localStorage.getItem("sse-summarySelectedToEdit")

    if (localStorage.getItem("sse-activeClick-custom") === "clone") {
        let summaryObj = JSON.parse(selectedSummaryClone)
        if (summaryObj.id) delete summaryObj.id
        if (summaryObj.dashboard) delete summaryObj.dashboard
        if (summaryObj.category && !Array.isArray(summaryObj.category)) {
            summaryObj.category = summaryObj.category.split("|")
        }
        // console.log("Calling clone: ", summaryObj)
        localStorage.removeItem("sse-summarySelectedToClone")
        localStorage.removeItem("sse-activeClick-custom")

        require([
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
            ),
        ], function () {
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
                        ShowcaseInfo.summaries[showcaseId] = summary
                        ProcessSummaryUI.addItem_async($, ShowcaseInfo, summary)
                    },
                })
            }, summaryObj)
        })
    } else if (localStorage.getItem("sse-activeClick-custom") === "edit") {
        let summaryObj = JSON.parse(selectedSummaryEdit)
        if (summaryObj.category && !Array.isArray(summaryObj.category)) {
            summaryObj.category = summaryObj.category.split("|")
        }
        localStorage.removeItem("sse-summarySelectedToEdit")
        localStorage.removeItem("sse-activeClick-custom")

        require([
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
            ),
        ], function () {
            customContentModal(function (showcaseId, summary) {
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
                        // console.log("Returned Data: " + returneddata)
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
            }, summaryObj)
        })
    }
    /////////////////////////////////////////
    /////  Manage Bookmark Modal  ///////////
    /////////////////////////////////////////

    function popAndAddFirstBookmark() {
        if (window.currentQueuedJSONReplacement["bookmarks"].length > 0) {
            record = window.currentQueuedJSONReplacement["bookmarks"].shift()
            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/",
                type: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Splunk-Form-Key": window.getFormKey(),
                },
                contentType: "application/json",
                async: false,
                data: JSON.stringify(record),
                success: function (returneddata) {
                    bustCache()
                    popAndAddFirstBookmark()
                },
                error: function (xhr, textStatus, error) {},
            })
        } else {
            $("#bookmarkStatus")
                .attr("status", "complete")
                .append($("<p>Success! Added all bookmarks</p>"))
            markAllBookmarkRestorationComplete()
        }
    }

    function popAndAddFirstCustomBookmark() {
        if (window.currentQueuedJSONReplacement["customBookmarks"].length > 0) {
            record =
                window.currentQueuedJSONReplacement["customBookmarks"].shift()
            $.ajax({
                url:
                    $C["SPLUNKD_PATH"] +
                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_custom/",
                type: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    "X-Splunk-Form-Key": window.getFormKey(),
                },
                contentType: "application/json",
                async: false,
                data: JSON.stringify(record),
                success: function (returneddata) {
                    bustCache()
                    popAndAddFirstCustomBookmark()
                },
                error: function (xhr, textStatus, error) {},
            })
        } else {
            $("#customBookmarkStatus")
                .attr("status", "complete")
                .append($("<p>Success! Added all custom content.</p>"))
            markAllBookmarkRestorationComplete()
        }
    }

    function markAllBookmarkRestorationComplete() {
        if (
            $("#bookmarkStatus").attr("status") == "complete" &&
            $("#customBookmarkStatus").attr("status") == "complete"
        ) {
            $(".modal:visible")
                .find(".modal-footer")
                .find("button")
                .text("Reload Page")
                .addClass("btn-primary")

            $(".modal:visible").on("hide", function () {
                location.reload()
            })
        }
    }
    require([
        "jquery",
        "underscore",
        "splunkjs/mvc",
        "splunkjs/mvc/utils",
        "splunkjs/mvc/tokenutils",
        "splunkjs/mvc/simplexml",
        "splunkjs/mvc/searchmanager",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/data/sendTelemetry.js"
        ),
        "splunkjs/ready!",
        "css!../app/Splunk_Security_Essentials/style/data_source_check.css",
        Splunk.util.make_full_url(
            "/static/app/Splunk_Security_Essentials/components/controls/ManageSnapshots.js"
        ),
    ], function (
        $,
        _,
        mvc,
        utils,
        TokenUtils,
        DashboardController,
        SearchManager,
        Telemetry,
        Ready
    ) {
        /////////////////////////////////////////
        /////    Core Functionality   ///////////
        /////////////////////////////////////////

        $("#bookmark_table").append(
            '<table style="" id="main_table" class="table table-chrome" ><thead><tr class="dvbanner">' +
                '<th style="width: 10px; text-align: center" class="tableexpand"><i class="icon-info"></i></th>' +
                '<th class="tableExample">Content</th>' +
                '<th style="text-align: center">Open</th>' +
                '<th style="text-align: center">Originating App</th>' +
                '<th style="text-align: center">User</th>' +
                '<th style="text-align: center">When Added</th>' +
                '<th style="text-align: center">Edit</th>' +
                '<th style="text-align: center"><span data-bs-placement="top" data-toggle="tooltip">Remove </span></th>' +
                '<th style="text-align: center"><span data-bs-placement="top" data-toggle="tooltip">Export </span></th>' +
                '</tr></thead><tbody id="main_table_body"></tbody></table>'
        )
        require(["vendor/bootstrap/bootstrap.bundle"], function () {
            $("[data-toggle=tooltip]").tooltip({ html: true })
        })
        $.getJSON(
            $C["SPLUNKD_PATH"] +
                "/services/SSEShowcaseInfo?locale=" +
                window.localeString,
            async function (ShowcaseInfo) {
                let fullShowcaseInfo = JSON.parse(JSON.stringify(ShowcaseInfo))
                window.fullShowcaseInfo = fullShowcaseInfo
                checkForErrors(fullShowcaseInfo)
                checkForOutOfDateCustomContent()

                let ShowcaseList = Object.keys(ShowcaseInfo.summaries)
                for (let i = 0; i < ShowcaseList.length; i++) {
                    if (
                        !ShowcaseInfo.summaries[ShowcaseList[i]].channel ||
                        ShowcaseInfo.summaries[ShowcaseList[i]].channel !=
                            "custom"
                    ) {
                        delete ShowcaseInfo.summaries[ShowcaseList[i]]
                        if (
                            ShowcaseInfo.roles.default.summaries.indexOf(
                                ShowcaseList[i]
                            ) >= 0
                        ) {
                            ShowcaseInfo.roles.default.summaries.splice(
                                ShowcaseInfo.roles.default.summaries.indexOf(
                                    ShowcaseList[i]
                                ),
                                1
                            )
                        }
                    }
                }
                if (ShowcaseInfo.roles.default.summaries.length == 0) {
                    setTimeout(function () {
                        noContentMessage()
                    }, 500)
                }
                // console.log("After: ", ShowcaseInfo)
                //  console.log("After new: ", newShowcaseInfo)
                ShowcaseInfo.roles.default.summaries.sort(function (a, b) {
                    if (
                        ShowcaseInfo.summaries[a].name >
                        ShowcaseInfo.summaries[b].name
                    ) {
                        return 1
                    }
                    if (
                        ShowcaseInfo.summaries[a].name <
                        ShowcaseInfo.summaries[b].name
                    ) {
                        return -1
                    }
                    return 0
                })
                for (
                    var i = 0;
                    i < ShowcaseInfo.roles.default.summaries.length;
                    i++
                ) {
                    summary =
                        ShowcaseInfo.summaries[
                            ShowcaseInfo.roles.default.summaries[i]
                        ]
                    await ProcessSummaryUI.addItem_async(
                        $,
                        ShowcaseInfo,
                        summary
                    )
                }

                addingIndividualContent.resolve()
                window.ShowcaseInfo = ShowcaseInfo

                $("#layout1").append(
                    '<div id="bottomTextBlock" style=""></div>'
                )
                contentMessage()

                $(".panel-body").css("padding", "0px")
            }
        )

        require(["vendor/bootstrap/bootstrap.bundle"], function () {
            if ($(".dvTooltip").length > 0) {
                $(".dvTooltip").tooltip({ html: true })
            }
            if ($(".dvPopover").length > 0) {
                $(".dvPopover").popover({ html: true })
            }
        })

        $("#manageBookmarkLink").click(function () {
            require([
                Splunk.util.make_full_url(
                    "/static/app/Splunk_Security_Essentials/components/controls/ManageSnapshots.js"
                ),
            ], function () {
                manageContentModal()
            })
        })

        $(".dashboard-export-container").css("display", "none")

        $(".dashboard-view-controls").prepend(
            $(
                '<a class="btn" style="margin-right: 4px;" href="#" >Export <i class="icon-export" /></a>'
            ).click(function () {
                LaunchExportDialog(ShowcaseInfo)
            })
        )
        // $(".dashboard-view-controls").prepend($("<button style=\"margin-left: 5px;\" class=\"btn\">Print to PDF</button>").click(function() { window.print() }));
        $("#introspectContentLink").click(function () {
            popModalToLookForEnabledContent()
        })
    })

    $("#restoredDeletedContent").click(function () {
        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/deleted_custom_content",
            type: "GET",
            contentType: "application/json",
            async: false,
            success: function (data) {
                let coreContent = $("<div>")

                if (data.length == 0) {
                    coreContent.append("<p>No content found</p>")
                } else {
                    let table = $(
                        '<table id="restoreList" class="table table-striped"><thead><tr><th>Source</th><th>When Removed</th><th>User who Removed</th><th>Name</th><th>Restore</th><th>Purge</th></tr></thead><tbody></tbody></table>'
                    )
                    let tbody = table.find("tbody")
                    // console.log("Got my data!", data)
                    for (let i = 0; i < data.length; i++) {
                        let row = $("<tr>")
                            .attr("data-showcaseid", data[i]["showcaseId"])
                            .attr("data-key", data[i]["_key"])
                            .attr("data-json", data[i]["json"])
                        let showcaseName = "-Unknown-"
                        try {
                            showcaseName = JSON.parse(data[i]["json"])["name"]
                        } catch {}
                        row.append(
                            $('<td class="recycling-channel">').text(
                                data[i]["channel"]
                            )
                        )
                        row.append(
                            $('<td class="recycling-time">').text(
                                data[i]["_time"]
                            )
                        )
                        row.append(
                            $('<td class="recycling-user">').text(
                                data[i]["user"]
                            )
                        )
                        row.append(
                            $('<td class="recycling-name">').text(showcaseName)
                        )
                        //row.append($('<td class="recycling-json">').html($('<a href="#" title="JSON" data-placement="top" data-toggle="popover" data-trigger="hover" data-content="' + data[i]['json'].replace(/"/g, "&quot;") + '">?</a>')))
                        row.append(
                            $("<td>").append(
                                $('<button class="btn">')
                                    .text("Restore")
                                    .click(function (evt) {
                                        let target = $(evt.target)
                                        let row = target.closest("tr")
                                        let showcaseId =
                                            row.attr("data-showcaseid")
                                        let key = row.attr("data-key")
                                        let record = {
                                            _time: new Date().getTime() / 1000,
                                            _key: showcaseId,
                                            showcaseId: showcaseId,
                                            channel: "custom",
                                            json: row.attr("data-json"),
                                            user: Splunk.util.getConfigValue(
                                                "USERNAME"
                                            ),
                                        }

                                        $.ajax({
                                            url:
                                                $C["SPLUNKD_PATH"] +
                                                '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/?query={"showcaseId": "' +
                                                showcaseId +
                                                '"}',
                                            type: "GET",
                                            contentType: "application/json",
                                            async: false,
                                            success: function (returneddata) {
                                                if (returneddata.length == 0) {
                                                    $.ajax({
                                                        url:
                                                            $C["SPLUNKD_PATH"] +
                                                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content",
                                                        type: "POST",
                                                        headers: {
                                                            "X-Requested-With":
                                                                "XMLHttpRequest",
                                                            "X-Splunk-Form-Key":
                                                                window.getFormKey(),
                                                        },
                                                        contentType:
                                                            "application/json",
                                                        async: true,
                                                        data: JSON.stringify(
                                                            record
                                                        ),
                                                        success: function (
                                                            returneddata
                                                        ) {
                                                            setTimeout(
                                                                function () {
                                                                    $.ajax({
                                                                        url:
                                                                            $C[
                                                                                "SPLUNKD_PATH"
                                                                            ] +
                                                                            "/services/SSEShowcaseInfo?locale=" +
                                                                            window.localeString +
                                                                            "&bust=" +
                                                                            Math.round(
                                                                                Math.random() *
                                                                                    20000000
                                                                            ),
                                                                        async: true,
                                                                        success:
                                                                            async function (
                                                                                returneddata
                                                                            ) {
                                                                                $.ajax(
                                                                                    {
                                                                                        url:
                                                                                            $C[
                                                                                                "SPLUNKD_PATH"
                                                                                            ] +
                                                                                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/deleted_custom_content/" +
                                                                                            key,
                                                                                        type: "DELETE",
                                                                                        headers:
                                                                                            {
                                                                                                "X-Requested-With":
                                                                                                    "XMLHttpRequest",
                                                                                                "X-Splunk-Form-Key":
                                                                                                    window.getFormKey(),
                                                                                            },
                                                                                        async: true,
                                                                                        success:
                                                                                            function (
                                                                                                returneddata
                                                                                            ) {
                                                                                                row.remove()
                                                                                            },
                                                                                    }
                                                                                )
                                                                                bustCache()
                                                                                $(
                                                                                    "#confirmClear"
                                                                                ).modal(
                                                                                    "hide"
                                                                                )
                                                                                let summary =
                                                                                    returneddata
                                                                                        .summaries[
                                                                                        showcaseId
                                                                                    ]
                                                                                ShowcaseInfo.summaries[
                                                                                    showcaseId
                                                                                ] =
                                                                                    summary
                                                                                ShowcaseInfo.roles.default.summaries.push(
                                                                                    showcaseId
                                                                                )

                                                                                await ProcessSummaryUI.addItem_async(
                                                                                    $,
                                                                                    ShowcaseInfo,
                                                                                    summary
                                                                                )

                                                                                let myModal =
                                                                                    new Modal(
                                                                                        "clearConfirmed",
                                                                                        {
                                                                                            title: "Complete",
                                                                                            destroyOnHide: true,
                                                                                            type: "wide",
                                                                                        },
                                                                                        $
                                                                                    )

                                                                                myModal.body.html(
                                                                                    $(
                                                                                        "<div>"
                                                                                    ).append(
                                                                                        $(
                                                                                            "<p>This custom content has been restored.</p>"
                                                                                        )
                                                                                    )
                                                                                )
                                                                                myModal.footer.append(
                                                                                    $(
                                                                                        "<button>"
                                                                                    )
                                                                                        .attr(
                                                                                            {
                                                                                                type: "button",
                                                                                                "data-dismiss":
                                                                                                    "modal",
                                                                                                "data-bs-dismiss":
                                                                                                    "modal",
                                                                                            }
                                                                                        )
                                                                                        .addClass(
                                                                                            "btn btn-primary "
                                                                                        )
                                                                                        .text(
                                                                                            "Close"
                                                                                        )
                                                                                )
                                                                                myModal.show()
                                                                            },
                                                                    })
                                                                },
                                                                1000
                                                            )
                                                        },
                                                        error: function () {
                                                            triggerError(
                                                                "Error restoring deleted content."
                                                            )
                                                        },
                                                    })
                                                } else {
                                                    triggerError(
                                                        "Couldn't restore content. Existing content with the same id already exists. First remove " +
                                                            ShowcaseInfo[
                                                                "summaries"
                                                            ][
                                                                returneddata[0][
                                                                    "showcaseId"
                                                                ]
                                                            ]["name"]
                                                    )
                                                }
                                            },
                                            error: function (
                                                error,
                                                data,
                                                other
                                            ) {
                                                triggerError(
                                                    "Unknown error restoring"
                                                )
                                            },
                                        })
                                        // console.log("Restoring", record)
                                    })
                            )
                        )
                        row.append(
                            $("<td>").append(
                                $('<i class="icon-close">')
                                    .css("cursor", "pointer")
                                    .click(function (evt) {
                                        let target = $(evt.target)
                                        let row = target.closest("tr")
                                        let showcaseId =
                                            row.attr("data-showcaseid")
                                        let key = row.attr("data-key")
                                        let name = row
                                            .find(".recycling-name")
                                            .text()
                                        let time = row
                                            .find(".recycling-time")
                                            .text()
                                        let myModal = new Modal(
                                            "confirmPurge",
                                            {
                                                title: "Confirm Purge",
                                                destroyOnHide: true,
                                                type: "wide",
                                            },
                                            $
                                        )

                                        myModal.body.html(
                                            $("<div>").append(
                                                $(
                                                    '<p>Are you sure you would like to purge this content?</p><table class="table"><thead><tr><th>Name</th><th>Time</th></tr></thead><tbody><tr><td>' +
                                                        name +
                                                        "</td><td>" +
                                                        time +
                                                        "</td></tr></tbody></table>"
                                                )
                                            )
                                        )
                                        myModal.footer.append(
                                            $("<button>")
                                                .attr({
                                                    type: "button",
                                                    "data-dismiss": "modal",
                                                    "data-bs-dismiss": "modal",
                                                })
                                                .addClass("btn btn-primary ")
                                                .text("Cancel"),
                                            $("<button>")
                                                .attr({
                                                    type: "button",
                                                })
                                                .addClass("btn btn-primary ")
                                                .text("Purge")
                                                .click(function () {
                                                    $.ajax({
                                                        url:
                                                            $C["SPLUNKD_PATH"] +
                                                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/deleted_custom_content/" +
                                                            key,
                                                        type: "DELETE",
                                                        headers: {
                                                            "X-Requested-With":
                                                                "XMLHttpRequest",
                                                            "X-Splunk-Form-Key":
                                                                window.getFormKey(),
                                                        },
                                                        async: true,
                                                        success: function (
                                                            returneddata
                                                        ) {
                                                            row.remove()
                                                            $(
                                                                "#confirmPurge"
                                                            ).modal("hide")
                                                            let myModal =
                                                                new Modal(
                                                                    "confirmPurge",
                                                                    {
                                                                        title: "Item Purged",
                                                                        destroyOnHide: true,
                                                                        type: "wide",
                                                                    },
                                                                    $
                                                                )

                                                            myModal.body.html(
                                                                $(
                                                                    "<div>"
                                                                ).append(
                                                                    $(
                                                                        "<p>Success!</p>"
                                                                    )
                                                                )
                                                            )
                                                            myModal.footer.append(
                                                                $("<button>")
                                                                    .attr({
                                                                        type: "button",
                                                                        "data-dismiss":
                                                                            "modal",
                                                                        "data-bs-dismiss":
                                                                            "modal",
                                                                    })
                                                                    .addClass(
                                                                        "btn btn-primary "
                                                                    )
                                                                    .text(
                                                                        "Close"
                                                                    )
                                                            )
                                                            myModal.show()
                                                        },
                                                    })
                                                })
                                        )
                                        myModal.show()
                                    })
                            )
                        )
                        tbody.append(row)
                    }
                    coreContent.append(table)
                }

                let myModal = new Modal(
                    "confirmClear",
                    {
                        title: "Restore Deleted Content",
                        destroyOnHide: true,
                        type: "wide",
                    },
                    $
                )
                $(myModal.$el).on("hide", function () {
                    // Not taking any action on hide, but you can if you want to!
                })

                myModal.body.html(
                    $(
                        "<p>Below is a listing of content that can be restored</p>"
                    )
                )
                myModal.body.append(coreContent)

                myModal.footer.append(
                    $("<button>")
                        .attr({
                            type: "button",
                            "data-dismiss": "modal",
                            "data-bs-dismiss": "modal",
                        })
                        .addClass("btn btn-primary ")
                        .text("Close")
                        .on("click", function () {})
                )
                myModal.show()
            },
            error: function (error, data, other) {
                triggerError("Error retrieving deleted custom content")
            },
        })
    })

    $("#addCustomContent").click(function () {
        require([
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
            ),
        ], function () {
            customContentModal(function (showcaseId, summary) {
                // console.log("Successfully Added", showcaseId, summary)
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
                        // console.log("Successfully Got it back", showcaseId, summary)
                        ShowcaseInfo.summaries[showcaseId] = summary
                        ShowcaseInfo.roles.default.summaries.push(showcaseId)

                        ProcessSummaryUI.addItem_async(
                            $,
                            ShowcaseInfo,
                            summary
                        ).then((_) => {
                            refreshShowcaseInfoMini()
                        })
                    },
                })
            })
        })
    })

    function editContent(obj) {
        let showcaseId = $(obj).attr("data-showcaseid")
        // console.log("Popping for showcase", showcaseId);
        require([
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
            ),
        ], function () {
            let summaryObj = ShowcaseInfo.summaries[showcaseId]
            if (summaryObj.category && !Array.isArray(summaryObj.category)) {
                summaryObj.category = summaryObj.category.split("|")
            }
            customContentModal(function (showcaseId, summary) {
                // console.log("Successfully Edited", showcaseId, summary)
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
                        ShowcaseInfo.summaries[showcaseId] = summary
                        ProcessSummaryUI.addItem_async(
                            $,
                            ShowcaseInfo,
                            summary
                        ).then((_) => {
                            refreshShowcaseInfoMini()
                        })
                    },
                })
            }, summaryObj)
        })
    }
    window.editContent = editContent

    function removeContent(obj) {
        let showcaseId = $(obj).attr("data-showcaseid")
        let showcaseName = $(obj).attr("data-name")
        let haveCurrentObj = $.Deferred()

        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/?query={"showcaseId": "' +
                showcaseId +
                '"}',
            type: "GET",
            contentType: "application/json",
            async: false,
            success: function (returneddata) {
                haveCurrentObj.resolve(returneddata[0])
            },
            error: function (error, data, other) {
                haveCurrentObj.resolve()
            },
        })

        let myModal = new Modal(
            "confirmClear",
            {
                title: "Remove Custom Content",
                destroyOnHide: true,
                type: "wide",
            },
            $
        )
        $(myModal.$el).on("hide", function () {
            // Not taking any action on hide, but you can if you want to!
        })

        let body = $("<div>").append(
            $(
                "<p>Are you sure you would like to remove <i>" +
                    showcaseName +
                    "</i>? Your deleted custom content will be persisted in the Recycling Bin and can be restored later if needed.</p>"
            )
        )
        myModal.body.html(body)

        myModal.footer.append(
            $("<button>")
                .attr({
                    type: "button",
                    "data-dismiss": "modal",
                    "data-bs-dismiss": "modal",
                })
                .addClass("btn ")
                .text("Cancel")
                .on("click", function () {}),
            $("<button>")
                .attr({
                    type: "button",
                })
                .addClass("btn btn-primary ")
                .text("Remove")
                .on("click", function () {
                    $.when(haveCurrentObj).then(function (existingObj) {
                        if (
                            typeof existingObj == "object" &&
                            existingObj["json"] &&
                            existingObj["showcaseId"]
                        ) {
                            let record = {
                                _time: new Date().getTime() / 1000,
                                showcaseId: existingObj["showcaseId"],
                                channel: existingObj["channel"],
                                json: existingObj["json"],
                                user: Splunk.util.getConfigValue("USERNAME"),
                            }
                            $.ajax({
                                url:
                                    $C["SPLUNKD_PATH"] +
                                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/deleted_custom_content",
                                type: "POST",
                                headers: {
                                    "X-Requested-With": "XMLHttpRequest",
                                    "X-Splunk-Form-Key": window.getFormKey(),
                                },
                                contentType: "application/json",
                                async: true,
                                data: JSON.stringify(record),
                                success: function (returneddata) {
                                    $.ajax({
                                        url:
                                            $C["SPLUNKD_PATH"] +
                                            '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/?query={"showcaseId": "' +
                                            showcaseId +
                                            '"}',
                                        type: "DELETE",
                                        headers: {
                                            "X-Requested-With":
                                                "XMLHttpRequest",
                                            "X-Splunk-Form-Key":
                                                window.getFormKey(),
                                        },
                                        async: true,
                                        success: function (returneddata) {
                                            bustCache()
                                            deleteAllContentMappings(showcaseId)

                                            $(
                                                "[data-showcaseid=" +
                                                    showcaseId +
                                                    "]"
                                            ).remove()

                                            if ($("tr.titleRow").length === 0) {
                                                noContentMessage()
                                            }

                                            let myModal = new Modal(
                                                "clearConfirmed",
                                                {
                                                    title: "Complete",
                                                    destroyOnHide: true,
                                                    type: "wide",
                                                },
                                                $
                                            )

                                            myModal.body.html(
                                                $("<div>").append(
                                                    $(
                                                        "<p>This custom content has been removed. It can be restored from the recycling bin.</p>"
                                                    )
                                                )
                                            )
                                            myModal.footer.append(
                                                $("<button>")
                                                    .attr({
                                                        type: "button",
                                                        "data-dismiss": "modal",
                                                        "data-bs-dismiss":
                                                            "modal",
                                                    })
                                                    .addClass(
                                                        "btn btn-primary "
                                                    )
                                                    .text("Close")
                                            )
                                            myModal.show()

                                            refreshShowcaseInfoMini()
                                        },
                                        error: function (
                                            xhr,
                                            textStatus,
                                            error
                                        ) {
                                            bustCache()

                                            let myModal = new Modal(
                                                "clearConfirmed",
                                                {
                                                    title: "Error!",
                                                    destroyOnHide: true,
                                                    type: "wide",
                                                },
                                                $
                                            )
                                            myModal.body.html(
                                                $("<div>").append(
                                                    $(
                                                        "<p>Error removing content.</p>"
                                                    ),
                                                    $("<pre>").text(textStatus)
                                                )
                                            )
                                            myModal.footer.append(
                                                $("<button>")
                                                    .attr({
                                                        type: "button",
                                                        "data-dismiss": "modal",
                                                        "data-bs-dismiss":
                                                            "modal",
                                                    })
                                                    .addClass(
                                                        "btn btn-primary "
                                                    )
                                                    .text("Close")
                                            )
                                            myModal.show()

                                            refreshShowcaseInfoMini()
                                        },
                                    })
                                },
                                error: function (xhr, textStatus, error) {
                                    console.error(
                                        "Error Updating!",
                                        xhr,
                                        textStatus,
                                        error
                                    )
                                    triggerError(
                                        "Error Adding Existing Entry to Recycling Bin. Please reach out to sse@splunk.com for assistance, referencing your scenario and this error: " +
                                            xhr.responseText
                                    )
                                },
                            })
                        } else {
                            triggerError(
                                "Error retrieving existing key to facilitate backup (deleted_custom_content collection not present or functioning?). Please reach out to sse@splunk.com for assistance."
                            )
                        }
                    })

                    $("[data-bs-dismiss=modal").click()
                })
        )
        myModal.show()
    }
    window.removeContent = removeContent

    function noContentMessage() {
        $("#bottomTextBlock").css("background-color", "white")
        $("#bottomTextBlock").css("text-align", "center")
        $("#bottomTextBlock").html(
            "<h3>No Custom Content Created</h3><p>Please click <i>Add Custom Content</i> in the upper right box, to add new content.</p>"
        )
        $("#bottomTextBlock").css("display", "block")
        $("#dataSourcePanel").html("")
    }

    function contentMessage() {
        // $("#bottomTextBlock").html('<div class="printandexporticons"><a href="#" id="printUseCaseIcon" onclick="doPrint(); return false;"><i class="icon-print icon-no-underline" style="font-size: 16pt;" /> Print Page </a>&nbsp;&nbsp;<a href="#" id="downloadUseCaseIcon" onclick="DownloadAllUseCases(); return false;"><i class="icon-export" style="font-size: 16pt;" /> Export Content List </a></div>')
        //$("#bottomTextBlock").css("background-color","#f0f2f3")
        $("#bottomTextBlock").css("background-color", "rgba(0,0,0,0)")
        $("#bottomTextBlock").css("text-align", "right")
    }

    function removeRow(showcaseId) {
        //console.log("Removing row for", id, ShowcaseInfo.summaries[id],ShowcaseInfo.summaries[id].name, $("td:contains(" + ShowcaseInfo.summaries[id].name + ")"))

        $(".titleRow[data-showcaseid=" + showcaseId + "]").remove()
        $(".descriptionRow[data-showcaseid=" + showcaseId + "]").remove()
        $(".printable_section[data-showcaseid=" + showcaseId + "]").remove()

        if ($("#main_table_body tr").length == 0) {
            noContentMessage()
        }

        delete window.ShowcaseInfo.summaries[showcaseId]
        window.ShowcaseInfo.roles.default.summaries.splice(
            window.ShowcaseInfo.roles.default.summaries.indexOf(showcaseId),
            1
        )
    }

    function setbookmark_status(name, showcaseId, status, action) {
        if (!action) {
            action = "bookmarked_content"
        }
        ShowcaseInfo.summaries[showcaseId].bookmark_status = status
        require([
            "components/data/sendTelemetry",
            "json!" +
                $C["SPLUNKD_PATH"] +
                "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/sse_app_config",
        ], function (Telemetry, appConfig) {
            let record = { status: status, name: name, selectionType: action }
            for (let i = 0; i < appConfig.length; i++) {
                if (
                    appConfig[i].param == "demoMode" &&
                    appConfig[i].value == "true"
                ) {
                    record.demoMode = true
                }
            }
            Telemetry.SendTelemetryToSplunk("BookmarkChange", record)
        })

        require(["splunkjs/mvc/utils", "splunkjs/mvc/searchmanager"], function (
            utils,
            SearchManager
        ) {
            let desiredSearchName =
                "logBookmarkChange-" + name.replace(/[^a-zA-Z0-9]/g, "_")
            if (
                typeof splunkjs.mvc.Components.getInstance(desiredSearchName) ==
                "object"
            ) {
                // console.log(desiredSearchName, "already exists. This probably means you're copy-pasting the same code repeatedly, and so we will clear out the old object for convenience")
                splunkjs.mvc.Components.revokeInstance(desiredSearchName)
            }
            new SearchManager(
                {
                    id: desiredSearchName,
                    latest_time: "0",
                    autostart: true,
                    earliest_time: "now",
                    search:
                        '| makeresults | eval app="' +
                        utils.getCurrentApp() +
                        '", page="' +
                        splunkjs.mvc.Components.getInstance("env").toJSON()[
                            "page"
                        ] +
                        '", user="' +
                        $C["USERNAME"] +
                        '", name="' +
                        name +
                        '", status="' +
                        status +
                        '" | collect index=_internal sourcetype=essentials:bookmark',
                    app: utils.getCurrentApp(),
                    auto_cancel: 90,
                },
                { tokens: false }
            )
        })
        for (var i = 0; i < window.ShowcaseInfo.roles.default.summaries; i++) {
            if (
                name ==
                window.ShowcaseInfo.summaries[
                    window.ShowcaseInfo.roles.default.summaries[i]
                ]
            ) {
                window.ShowcaseInfo.summaries[
                    window.ShowcaseInfo.roles.default.summaries[i]
                ].bookmark_status = status
            }
        }

        var record = {
            _time: new Date().getTime() / 1000,
            _key: showcaseId,
            showcase_name: name,
            status: status,
            user: Splunk.util.getConfigValue("USERNAME"),
        }

        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/?query={"_key": "' +
                record["_key"] +
                '"}',
            type: "GET",
            contentType: "application/json",
            async: false,
            success: function (returneddata) {
                if (returneddata.length == 0) {
                    // New

                    $.ajax({
                        url:
                            $C["SPLUNKD_PATH"] +
                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/",
                        type: "POST",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "X-Splunk-Form-Key": window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: false,
                        data: JSON.stringify(record),
                        success: function (returneddata) {
                            bustCache()
                            newkey = returneddata
                        },
                        error: function (xhr, textStatus, error) {},
                    })
                } else {
                    // Old
                    $.ajax({
                        url:
                            $C["SPLUNKD_PATH"] +
                            "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/" +
                            record["_key"],
                        type: "POST",
                        headers: {
                            "X-Requested-With": "XMLHttpRequest",
                            "X-Splunk-Form-Key": window.getFormKey(),
                        },
                        contentType: "application/json",
                        async: false,
                        data: JSON.stringify(record),
                        success: function (returneddata) {
                            bustCache()
                            newkey = returneddata
                        },
                        error: function (xhr, textStatus, error) {
                            //              console.log("Error Updating!", xhr, textStatus, error)
                        },
                    })
                }
            },
            error: function (error, data, other) {
                //     console.log("Error Code!", error, data, other)
            },
        })
    }

    function b64DecodeUnicode(str) {
        // Going backwards: from bytestream, to percent-encoding, to original string.
        return decodeURIComponent(
            atob(str)
                .split("")
                .map(function (c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join("")
        )
    }

    function b64EncodeUnicode(str) {
        // first we use encodeURIComponent to get percent-encoded UTF-8,
        // then we convert the percent encodings into raw bytes which
        // can be fed into btoa.
        return btoa(
            encodeURIComponent(str).replace(
                /%([0-9A-F]{2})/g,
                function toSolidBytes(match, p1) {
                    return String.fromCharCode("0x" + p1)
                }
            )
        )
    }

    async function addItem(summary) {
        return await require([
            "jquery",
            "underscore",
            Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/controls/ProcessSummaryUI.js"
            ),
        ], async function ($, _, ProcessSummaryUI) {
            //console.log("Running addItem on", summary)
            let rowStatus = ""
            let statuses = Object.keys(BookmarkStatus)
            for (let i = 0; i < statuses.length; i++) {
                if (statuses[i] == "none") {
                    continue
                }
                rowStatus +=
                    '<td style="text-align: center" class="table' +
                    statuses[i] +
                    '">' +
                    '<input type="radio" name="' +
                    summary.id +
                    '" data-status="' +
                    statuses[i] +
                    '" data-showcaseid="' +
                    summary.id +
                    '" data-name="' +
                    summary.name +
                    '" onclick="radioUpdateSetting(this)" ' +
                    (summary.bookmark_status == statuses[i] ? "checked" : "") +
                    ">" +
                    "</td>"
            }
            rowStatus +=
                '<td style="text-align: center" class="tableclose" >' +
                '<i class="icon-close" style="font-size: 20px;"  name="' +
                summary.id +
                '" data-status="none" data-showcaseid="' +
                summary.id +
                '" data-name="' +
                summary.name +
                '" onclick="radioUpdateSetting(this)" >' +
                "</td>"
            var status_display = BookmarkStatus[summary.bookmark_status]
            var SPL = $('<div class="donotbreak"></div>')
            if (
                typeof summary.examples == "object" &&
                summary.examples.length > 0
            ) {
                SPL.append("<h2>SPL for " + summary.name + "</h2>")
                for (var i = 0; i < summary.examples.length; i++) {
                    if (
                        typeof examples[summary.examples[i].name] != "undefined"
                    ) {
                        var localexample = $(
                            '<div class="donotbreak"></div>'
                        ).append(
                            $("<h3>" + summary.examples[i].tag + "</h3>"),
                            $(examples[summary.examples[i].name].linebylineSPL)
                        )
                        SPL.append(localexample)
                    }
                }
            }
            var printableimage = $("")
            if (
                typeof summary.printable_image != "undefined" &&
                summary.printable_image != "" &&
                summary.printable_image != null
            ) {
                printableimage = $(
                    '<div class="donotbreak" style="margin-top: 15px;"><h2>Screenshot of Demo Data</h2></div>'
                ).append(
                    $('<img class="printonly" />').attr(
                        "src",
                        summary.printable_image
                    )
                )
            }
            var linkToExample = ""
            if (typeof summary.dashboard != "undefined") {
                linkToExample =
                    '<a href="' +
                    cleanLink(
                        fullyDecodeURIComponent(summary.dashboard),
                        false
                    ) +
                    '" class="external drilldown-link" target="_blank"></a>'
            }
            // <th style=\"width: 10px; text-align: center\" class=\"tableexpand\"><i class=\"icon-info\"></i></th>"+
            //                         "<th class=\"tableExample\">Content</th>" +
            //                         "<th style=\"text-align: center\">Open</th>"+
            //                         "<th style=\"text-align: center\">User</th>"+
            //                         "<th style=\"text-align: center\">When Added</th>"+
            //                         "<th style=\"text-align: center\">Edit</th>"+
            //                         "<th style=\"text-align: center\"><span data-placement=\"top\" data-toggle=\"tooltip\" title=\"Removing here just means removing the bookmark, not the entire content. You will still be able to find it on the Security Contents page, and be able to re-add the bookmark later.\">Remove <i class=\"icon-info-circle\" /></span></th>" +
            //                         "</tr></thead><tbody id=\"main_table_body\"></tbody></ta
            var date = new Date(parseInt(summary.custom_time * 1000))
            let timeStr = date.toLocaleString(window.localeString, {
                month: "numeric",
                year: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            })
            let displayapp = summary.displayapp
            if (summary.inSplunk == "no" && displayapp == "Custom Content") {
                displayapp = ""
            } else if (summary.inSplunk == "yes") {
                displayapp = "Splunk"
            }

            let titleRow = $(
                '<tr class="titleRow" data-showcaseId="' +
                    summary.id +
                    '"  class="dvbanner">' +
                    '<td class="tableexpand" class="downarrow" ><a href="#" onclick="doToggle(this); return false;"><i class="icon-chevron-right" /></a></td>' +
                    '<td class="name content-name"><div></div><a href="#" onclick="doToggle(this); return false;">' +
                    summary.name +
                    "</a></td>" +
                    '<td style="text-align: center">' +
                    linkToExample +
                    "</td>" +
                    '<td style="text-align: center">' +
                    displayapp +
                    "</td>" +
                    '<td class="content-user" style="text-align: center">' +
                    cleanLink(summary.custom_user, false) +
                    "</td>" +
                    '<td class="content-time" style="text-align: center">' +
                    timeStr +
                    "</td>" +
                    '<td style="text-align: center" class="tableedit" ><i class="icon-pencil" style="font-size: 20px;"  name="' +
                    summary.id +
                    '" data-showcaseid="' +
                    summary.id +
                    '" data-name="' +
                    summary.name +
                    '" onclick="editContent(this)" ></td>' +
                    '<td style="text-align: center" class="tableclose" ><i class="icon-close" style="font-size: 20px;"  name="' +
                    summary.id +
                    '" data-status="none" data-showcaseid="' +
                    summary.id +
                    '" data-name="' +
                    summary.name +
                    '" onclick="removeContent(this)" ></td>' +
                    "</tr>"
            )
            titleRow.attr(
                "data-json",
                JSON.stringify(summary)
                    .replace(/\\/g, "\\\\")
                    .replace(/"/g, '\\"')
                    .replace(/\|/g, "\\|")
            )
            titleRow.append(
                $('<td  style="text-align: center" class="snapshot-">').html(
                    $('<i class="icon-export" style="cursor: pointer;">').click(
                        function (evt) {
                            let target = $(evt.target)
                            let row = target.closest("tr")
                            let output = {}
                            output["name"] = row.find(".content-name").text()
                            output["time"] = row.find(".content-time").text()
                            output["user"] = row.find(".content-user").text()
                            output["num_bookmarks"] = "0"
                            output["num_custom_items"] = "1"
                            window.dvtest = row.attr("data-json")

                            output["json"] = JSON.parse([
                                row
                                    .attr("data-json")
                                    .replace(/\\\|/g, "|")
                                    .replace(/\\"/g, '"'),
                            ])

                            let base64Output = b64EncodeUnicode(
                                JSON.stringify(output)
                            )

                            let myModal = new Modal(
                                "snapshotJSON",
                                {
                                    title: "Export a Backup",
                                    destroyOnHide: true,
                                },
                                $
                            )
                            $(myModal.$el).on("hide", function () {
                                // Not taking any action on hide, but you can if you want to!
                            })

                            let body = $("<div>")
                            body.append(
                                "<p>The following includes the content of this backup export, which is a JSON output encoded as base64. You can import this export into a Splunk Security Essentials instance by copying and pasting it into the Import Backup screen.</p>"
                            )
                            body.append(
                                $('<textarea id="importSnapshotBlob" />').text(
                                    base64Output
                                )
                            )
                            body.append(
                                $(
                                    '<a href="#" style="margin-left: 2%;">Copy Export</a>'
                                ).click(function () {
                                    var copyText =
                                        document.getElementById(
                                            "importSnapshotBlob"
                                        )
                                    copyText.select()
                                    document.execCommand("copy")
                                })
                            )
                            myModal.body.html(body)

                            myModal.footer.append(
                                $("<button>")
                                    .attr({
                                        type: "button",
                                        "data-dismiss": "modal",
                                        "data-bs-dismiss": "modal",
                                    })
                                    .addClass("btn ")
                                    .text("Close")
                                    .on("click", function () {})
                            )
                            myModal.show()
                        }
                    )
                )
            )
            let summaryUI =
                await ProcessSummaryUI.GenerateShowcaseHTMLBodyAsync(
                    summary,
                    ShowcaseInfo,
                    true
                )
            let description = summaryUI[0] + summaryUI[1]
            let descriptionRow = $(
                '<tr class="descriptionRow" data-showcaseId="' +
                    summary.id +
                    '"  style="display: none;"><td colspan="10">' +
                    description +
                    "</td></tr>"
            )
            if ($(".titleRow[data-showcaseid=" + summary.id + "]").length > 0) {
                $("#bookmark_printable_table")
                    .find("div[data-showcaseid=" + summary.id + "]")
                    .remove()
                $("#bookmark_printable_table").append(
                    $("<div>")
                        .addClass("printable_section")
                        .attr("data-showcaseid", summary.id)
                        .append(
                            $(
                                "<h1>" +
                                    summary.name +
                                    "</h1><h2>Status</h2><p>" +
                                    status_display +
                                    "</p>" +
                                    "<h2>App</h2><p>" +
                                    summary.displayapp +
                                    "</p>" +
                                    $(description.replace(/display: none/g, ""))
                                        .find("#contentDescription")
                                        .html()
                            ),
                            SPL,
                            printableimage
                        )
                )
                $(".titleRow[data-showcaseid=" + summary.id + "]").replaceWith(
                    titleRow
                )
                $(
                    ".descriptionRow[data-showcaseid=" + summary.id + "]"
                ).replaceWith(descriptionRow)
            } else {
                $("#bookmark_printable_table").append(
                    $("<div>")
                        .addClass("printable_section")
                        .attr("data-showcaseid", summary.id)
                        .append(
                            $(
                                "<h1>" +
                                    summary.name +
                                    "</h1><h2>Status</h2><p>" +
                                    status_display +
                                    "</p>" +
                                    "<h2>App</h2><p>" +
                                    summary.displayapp +
                                    "</p>" +
                                    $(description.replace(/display: none/g, ""))
                                        .find("#contentDescription")
                                        .html()
                            ),
                            SPL,
                            printableimage
                        )
                )
                $("#main_table_body").append(titleRow)
                $("#main_table_body").append(descriptionRow)
            }

            if ($("tr.titleRow").length > 0) {
                $("#bottomTextBlock").hide()
            }
        })
    }
    window.addItem = addItem

    // function DownloadAllUseCases() {
    //     var myDownload = []
    //     var myCSV = ""
    //     var myHeader = ["Name", "Description", "Wish List Status"]
    //     for (var filterCount = 0; filterCount < allFilters.length; filterCount++) {
    //         if (typeof allFilters[filterCount].export != "undefined" && allFilters[filterCount].export == "yes")
    //             myHeader.push(allFilters[filterCount].displayName)

    //     }
    //     myDownload.push(myHeader)
    //     myCSV += myHeader.join(",") + "\n"
    //     for (var i = 0; i < ShowcaseInfo.roles.default.summaries.length; i++) {
    //         var row = ['"' + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['name'].replace(/"/g, '""') + '"', '"' + ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['description'].replace(/"/g, '""').replace(/<br[^>]*>/g, " ") + '"']

    //         row.push('"' + BookmarkStatus[ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]]['bookmark_status']] + '"')
    //         for (var filterCount = 0; filterCount < allFilters.length; filterCount++) {
    //             if (typeof allFilters[filterCount].export != "undefined" && allFilters[filterCount].export == "yes") {
    //                 var line = ShowcaseInfo.summaries[ShowcaseInfo.roles.default.summaries[i]][allFilters[filterCount].fieldName] || "";
    //                 if (allFilters[filterCount].type == "search")
    //                     line = line.replace(/\|/g, ", ")
    //                 if (typeof allFilters[filterCount].manipulateDisplay != "undefined")
    //                     line = allFilters[filterCount].manipulateDisplay(line)

    //                 row.push('"' + line.replace(/"/g, '""') + '"')
    //             }
    //         }
    //         myDownload.push(row)
    //         myCSV += row.join(",") + "\n"
    //     }
    //     var filename = "Splunk_Security_Use_Cases.csv"

    //     var blob = new Blob([myCSV], { type: 'text/csv;charset=utf-8;' });
    //     if (navigator.msSaveBlob) { // IE 10+
    //         navigator.msSaveBlob(blob, filename);
    //     } else {
    //         var link = document.createElement("a");
    //         if (link.download !== undefined) { // feature detection
    //             // Browsers that support HTML5 download attribute
    //             var url = URL.createObjectURL(blob);
    //             link.setAttribute("href", url);
    //             link.setAttribute("download", filename);
    //             link.style.visibility = 'hidden';
    //             document.body.appendChild(link);
    //             link.click();
    //             document.body.removeChild(link);
    //         }
    //     }
    // }

    // window.DownloadAllUseCases = DownloadAllUseCases

    // $("#downloadUseCaseIcon").click(function() { DownloadAllUseCases(); return false; })

    // function doPrint() {

    //     window.print();
    // }
    // window.doPrint = doPrint

    // function formatDate(date) {
    //     var monthNames = [
    //         "January", "February", "March",
    //         "April", "May", "June", "July",
    //         "August", "September", "October",
    //         "November", "December"
    //     ];

    //     var day = date.getDate();
    //     var monthIndex = date.getMonth();
    //     var year = date.getFullYear();

    //     return day + ' ' + monthNames[monthIndex] + ' ' + year;
    // }

    $.when(addingIndividualContent).then(function () {
        // console.log("I got this")

        var newElement = $("#row1")
            .clone()
            .attr("id", "intropage")
            .addClass("printonly")
        newElement
            .find(".panel-body")
            .html(
                '<img src="' +
                    Splunk.util.make_full_url(
                        "/static/app/Splunk_Security_Essentials/images/general_images/splunk_icon.png"
                    ) +
                    '" style="position: absolute; right: 10px; top: -40px; display: block;" /><div id="intropageblock" style="margin-top: 200px;"><h1>Summary of Custom Content</h1><h2>Prepared ' +
                    formatDate(new Date()) +
                    '</h2><!--<h2 style="margin-top: 200px;">Table of Contents</h3><ol><li>Use Case Overview</li><li>Data Sources</li><li>Use Cases for Data Sources</li><li>Content Detail<ul id="usecasetoc"></ul></li></ol> --></div>'
            )
        newElement.insertBefore("#row1")

        // $("#bookmark_printable_table").find("h1").each(function(count, obj) {
        //     //   console.log("Adding", $(obj).html())
        //     $("#usecasetoc").append("<li>" + $(obj).html() + "</li>")
        // })
        // $("#row1").addClass("breakbeforethis")
    })

    function loadSPL() {
        $.ajax({
            url: Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_simple_search.json"
            ),
            async: true,
            success: function (returneddata) {
                var objects = Object.keys(returneddata)
                for (var i = 0; i < objects.length; i++) {
                    examples[objects[i]] = returneddata[objects[i]]
                    examples[objects[i]].file = "showcase_simple_search"
                    examples[objects[i]].searchString =
                        examples[objects[i]].value
                    examples[objects[i]].linebylineSPL =
                        "<pre>" + examples[objects[i]].searchString + "</pre>"
                    var linebylineSPL =
                        examples[objects[i]].searchString.split(/\n/)
                    if (
                        typeof examples[objects[i]].description !=
                            "undefined" &&
                        linebylineSPL.length > 0
                    ) {
                        var myTable = '<table class="linebylinespl">'
                        for (var g = 0; g < linebylineSPL.length; g++) {
                            myTable +=
                                "<tr>" +
                                '<td class="splside">' +
                                linebylineSPL[g] +
                                "</td>" +
                                '<td class="docside">' +
                                (examples[objects[i]].description[g] || "") +
                                "</td></tr>"
                        }
                        myTable += "</table>"
                        examples[objects[i]].linebylineSPL = myTable
                    }
                }
            },
        })
        $.ajax({
            url: Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_standard_deviation.json"
            ),
            async: true,
            success: function (returneddata) {
                var objects = Object.keys(returneddata)
                for (var i = 0; i < objects.length; i++) {
                    examples[objects[i]] = returneddata[objects[i]]
                    examples[objects[i]].file = "showcase_standard_deviation"
                    examples[objects[i]].searchString =
                        examples[objects[i]].value +
                        "\n| stats count as num_data_samples max(eval(if(_time >= relative_time(now(), \"-1d@d\"), '$outlierVariableToken$',null))) as '$outlierVariableToken$' avg(eval(if(_time<relative_time(now(),\"-1d@d\"),'$outlierVariableToken$',null))) as avg stdev(eval(if(_time<relative_time(now(),\"-1d@d\"),'$outlierVariableToken$',null))) as stdev by '$outlierVariableSubjectToken$' \n| eval upperBound=(avg+stdev*$scaleFactorToken$) \n | where '$outlierVariableToken$' > upperBound"
                    examples[objects[i]].searchString = examples[
                        objects[i]
                    ].searchString
                        .replace(
                            /\$outlierVariableToken\$/g,
                            examples[objects[i]].outlierVariable
                        )
                        .replace(
                            /\$outlierVariableSubjectToken\$/g,
                            examples[objects[i]].outlierVariableSubject
                        )
                        .replace(
                            /\$scaleFactorToken\$/g,
                            examples[objects[i]].scaleFactor
                        )
                        .replace(/\</g, "&lt;")
                        .replace(/\>/g, "&gt;")
                        .replace(/\n\s*/g, "\n")
                    examples[objects[i]].linebylineSPL =
                        "<pre>" + examples[objects[i]].searchString + "</pre>"
                    var linebylineSPL =
                        examples[objects[i]].searchString.split(/\n/)
                    if (
                        typeof examples[objects[i]].description !=
                            "undefined" &&
                        linebylineSPL.length > 0
                    ) {
                        examples[objects[i]].description.push(
                            "calculate the mean, standard deviation and most recent value",
                            "Calculate the upper boundary (X standard deviations above the average)",
                            "Filter where where the most recent result is above the upper boundary"
                        )
                        var myTable = '<table class="linebylinespl">'
                        for (var g = 0; g < linebylineSPL.length; g++) {
                            myTable +=
                                "<tr>" +
                                '<td class="splside">' +
                                linebylineSPL[g] +
                                "</td>" +
                                '<td class="docside">' +
                                (examples[objects[i]].description[g] || "") +
                                "</td></tr>"
                        }
                        myTable += "</table>"
                        examples[objects[i]].linebylineSPL = myTable
                    }
                }
            },
        })

        $.ajax({
            url: Splunk.util.make_full_url(
                "/static/app/Splunk_Security_Essentials/components/data/sampleSearches/showcase_first_seen_demo.json"
            ),
            async: true,
            success: function (returneddata) {
                var objects = Object.keys(returneddata)
                for (var i = 0; i < objects.length; i++) {
                    examples[objects[i]] = returneddata[objects[i]]
                    examples[objects[i]].file = "showcase_first_seen_demo"
                    examples[objects[i]].searchString =
                        examples[objects[i]].value +
                        '\n| stats earliest(_time) as earliest latest(_time) as latest  by $outlierValueTracked1Token$, $outlierValueTracked2Token$ \n| where earliest >= relative_time(now(), "-1d@d")'
                    examples[objects[i]].searchString = examples[
                        objects[i]
                    ].searchString
                        .replace(
                            /\$outlierValueTracked1Token\$/g,
                            examples[objects[i]].outlierValueTracked1
                        )
                        .replace(
                            /\$outlierValueTracked2Token\$/g,
                            examples[objects[i]].outlierValueTracked2
                        )
                        .replace(/\</g, "&lt;")
                        .replace(/\>/g, "&gt;")
                        .replace(/\n\s*/g, "\n")
                    examples[objects[i]].linebylineSPL =
                        "<pre>" + examples[objects[i]].searchString + "</pre>"
                    var linebylineSPL =
                        examples[objects[i]].searchString.split(/\n/)
                    if (
                        typeof examples[objects[i]].description !=
                            "undefined" &&
                        linebylineSPL.length > 0
                    ) {
                        examples[objects[i]].description.push(
                            "Here we use the stats command to calculate what the earliest and the latest time is that we have seen this combination of fields.",
                            "Now we look to see if the earliest time we saw this event was in the last day (aka, brand new)."
                        )
                        var myTable = '<table class="linebylinespl">'
                        for (var g = 0; g < linebylineSPL.length; g++) {
                            myTable +=
                                "<tr>" +
                                '<td class="splside">' +
                                linebylineSPL[g] +
                                "</td>" +
                                '<td class="docside">' +
                                (examples[objects[i]].description[g] || "") +
                                "</td></tr>"
                        }
                        examples[objects[i]].linebylineSPL = myTable
                        myTable += "</table>"
                        //     console.log("I got this:", examples[objects[i]].linebylineSPL)
                    }
                }
            },
        })
    }

    function checkForOutOfDateCustomContent() {
        $.ajax({
            url:
                $C["SPLUNKD_PATH"] +
                "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_custom",
            async: true,
            success: function (data) {
                let isOldContentPresent = false
                for (let i = 0; i < data.length; i++) {
                    if (
                        data[i].showcase_name.indexOf(
                            "MIGRATED TO NEW CUSTOM CONTENT"
                        ) == -1
                    ) {
                        isOldContentPresent = true
                    }
                }

                if (isOldContentPresent) {
                    $(".dashboard-view-controls").prepend(
                        $(
                            '<button style="margin-left: 5px;" class="btn"><b>Migrate Legacy Content</b></button>'
                        ).click(function () {
                            require([
                                Splunk.util.make_full_url(
                                    "/static/app/Splunk_Security_Essentials/components/controls/CustomContent.js"
                                ),
                            ], function () {
                                let table = $(
                                    '<table id="oldContentList" class="table table-striped"><thead><tr><th>Name</th><th>Data Source</th><th>Status</th><th>User Who Created</th><th>When Created</th><th>Restore</th><th>Delete</th></tr></thead><tbody></tbody></table>'
                                )
                                let tbody = table.find("tbody")
                                for (let i = 0; i < data.length; i++) {
                                    let row = $("<tr>")
                                        .attr(
                                            "data-name",
                                            data[i]["showcase_name"]
                                        )
                                        .attr("data-key", data[i]["_key"])
                                        .attr(
                                            "data-securityDataJourney",
                                            data[i]["securityDataJourney"]
                                        )
                                        .attr(
                                            "data-description",
                                            data[i]["description"]
                                        )
                                        .attr(
                                            "data-datasource",
                                            data[i]["datasource"]
                                        )
                                        .attr("data-status", data[i]["status"])
                                    let deleteDeferral = $.Deferred()

                                    row.append(
                                        $('<td class="oldcontent-name">').text(
                                            data[i]["showcase_name"]
                                        )
                                    )
                                    row.append(
                                        $(
                                            '<td class="oldcontent-datasource">'
                                        ).text(data[i]["datasource"])
                                    )
                                    row.append(
                                        $(
                                            '<td class="oldcontent-status">'
                                        ).text(data[i]["status"])
                                    )
                                    row.append(
                                        $('<td class="oldcontent-user">').text(
                                            data[i]["user"]
                                        )
                                    )
                                    row.append(
                                        $('<td class="oldcontent-time">').text(
                                            data[i]["_time"]
                                        )
                                    )

                                    row.append(
                                        $("<td>").append(
                                            $('<button class="btn">')
                                                .text("Restore")
                                                .click(function (evt) {
                                                    let target = $(evt.target)
                                                    let row =
                                                        target.closest("tr")
                                                    let key =
                                                        row.attr("data-key")
                                                    // console.log("Got a request to restore", target.closest("tr").attr("data-rowid"), target.closest("tr").html())
                                                    let summary = {
                                                        name: row.attr(
                                                            "data-name"
                                                        ),
                                                        securityDataJourney:
                                                            row.attr(
                                                                "data-securityDataJourney"
                                                            ),
                                                        description:
                                                            row.attr(
                                                                "data-description"
                                                            ),
                                                        bookmark_status:
                                                            row.attr(
                                                                "data-status"
                                                            ),
                                                    }

                                                    customContentModal(
                                                        function (
                                                            showcaseId,
                                                            summary
                                                        ) {
                                                            // console.log("Successfully Added", showcaseId, summary)
                                                            deleteDeferral.resolve(
                                                                key,
                                                                false
                                                            )
                                                            // There's some processing that occurs in SSEShowcaseInfo and we want to get the full detail here.
                                                            $.ajax({
                                                                url:
                                                                    $C[
                                                                        "SPLUNKD_PATH"
                                                                    ] +
                                                                    "/services/SSEShowcaseInfo?locale=" +
                                                                    window.localeString +
                                                                    "&bust=" +
                                                                    Math.round(
                                                                        Math.random() *
                                                                            20000000
                                                                    ),
                                                                async: true,
                                                                success:
                                                                    function (
                                                                        returneddata
                                                                    ) {
                                                                        let summary =
                                                                            returneddata
                                                                                .summaries[
                                                                                showcaseId
                                                                            ]
                                                                        // console.log("Got a return from SSEShowcaseInfo")
                                                                        // summary.id = showcaseId
                                                                        ShowcaseInfo.summaries[
                                                                            showcaseId
                                                                        ] =
                                                                            summary
                                                                        ShowcaseInfo.roles.default.summaries.push(
                                                                            showcaseId
                                                                        )

                                                                        ProcessSummaryUI.addItem_async(
                                                                            $,
                                                                            ShowcaseInfo,
                                                                            summary
                                                                        ).then(
                                                                            (
                                                                                _
                                                                            ) => {
                                                                                refreshShowcaseInfoMini()
                                                                            }
                                                                        )
                                                                    },
                                                            })
                                                        },
                                                        summary
                                                    )
                                                    //deleteDeferral.resolve(row.attr("data-key"), false)
                                                })
                                        )
                                    )
                                    row.append(
                                        $("<td>").append(
                                            $('<i class="icon-close">')
                                                .css("cursor", "pointer")
                                                .click(function (evt) {
                                                    let target = $(evt.target)
                                                    let row =
                                                        target.closest("tr")
                                                    deleteDeferral.resolve(
                                                        row.attr("data-key"),
                                                        true
                                                    )
                                                    //console.log("Got a request to delete", row.attr("data-key"))
                                                })
                                        )
                                    )
                                    tbody.append(row)

                                    let myModal = new Modal(
                                        "legacyContent",
                                        {
                                            title: "Legacy Content",
                                            destroyOnHide: true,
                                            type: "wide",
                                        },
                                        $
                                    )

                                    myModal.body.html(table)
                                    myModal.footer.append(
                                        $("<button>")
                                            .attr({
                                                type: "button",
                                                "data-dismiss": "modal",
                                                "data-bs-dismiss": "modal",
                                            })
                                            .addClass("btn btn-primary ")
                                            .text("Close")
                                    )
                                    myModal.show()

                                    $.when(deleteDeferral).then(function (
                                        key,
                                        shouldPopModal
                                    ) {
                                        if (key) {
                                            $.ajax({
                                                url:
                                                    $C["SPLUNKD_PATH"] +
                                                    "/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_custom/" +
                                                    key,
                                                type: "DELETE",
                                                headers: {
                                                    "X-Requested-With":
                                                        "XMLHttpRequest",
                                                    "X-Splunk-Form-Key":
                                                        window.getFormKey(),
                                                },
                                                async: true,
                                                success: function (
                                                    returneddata
                                                ) {
                                                    $(
                                                        "tr[data-key=" +
                                                            key +
                                                            "]"
                                                    ).remove()
                                                    if (shouldPopModal) {
                                                        let myModal = new Modal(
                                                            "contentRemoved",
                                                            {
                                                                title: "Removed",
                                                                destroyOnHide: true,
                                                                type: "wide",
                                                            },
                                                            $
                                                        )

                                                        myModal.body.html(
                                                            "<p>Success!</p>"
                                                        )
                                                        myModal.footer.append(
                                                            $("<button>")
                                                                .attr({
                                                                    type: "button",
                                                                    "data-dismiss":
                                                                        "modal",
                                                                    "data-bs-dismiss":
                                                                        "modal",
                                                                })
                                                                .addClass(
                                                                    "btn btn-primary "
                                                                )
                                                                .text("Close")
                                                        )
                                                        myModal.show()
                                                    }
                                                },
                                                error: function (
                                                    xhr,
                                                    textStatus,
                                                    error
                                                ) {
                                                    triggerError(
                                                        "Error deleting! " +
                                                            textStatus
                                                    )
                                                },
                                            })
                                        }
                                    })
                                }
                            })
                        })
                    )
                }
            },
        })
    }
})

setTimeout(function () {
    require([
        "underscore",
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/SSEShowcaseInfo?locale=" +
            window.localeString,
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/pullJSON?config=data_inventory&locale=" +
            window.localeString,
        "json!" +
            $C["SPLUNKD_PATH"] +
            "/services/pullJSON?config=mitreattack&locale=" +
            window.localeString,
        "components/controls/Modal",
    ], function (_, localShowcaseInfo, data_inventory, mitre_attack, Modal) {
        // Everything pre-loaded!
    })
}, 7500)

function doToggle(obj) {
    let container = $(obj).closest(".titleRow")
    let showcaseId = container.attr("data-showcaseid")
    let chevron = container.find(".icon-chevron-down, .icon-chevron-right")
    if (chevron.attr("class") == "icon-chevron-down") {
        $(".descriptionRow[data-showcaseid=" + showcaseId + "]").css(
            "display",
            "none"
        )
        chevron.attr("class", "icon-chevron-right")
    } else {
        $(".descriptionRow[data-showcaseid=" + showcaseId + "]").css(
            "display",
            "table-row"
        )
        chevron.attr("class", "icon-chevron-down")
        $(".descriptionRow[data-showcaseid=" + showcaseId + "]")
            .find("td")
            .css("border-top", 0)
    }
}

//# sourceURL=custom_content.js

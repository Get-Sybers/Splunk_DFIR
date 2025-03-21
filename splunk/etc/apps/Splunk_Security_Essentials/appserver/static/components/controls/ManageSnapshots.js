function manageContentModal() {
    let _ = require("underscore");
    let Modal;
    try{
        Modal = require("components/controls/Modal");
    }catch(error){
        Modal = require("app/Splunk_Security_Essentials/components/controls/Modal");
    }
    let myModal = new Modal('manageContentPrompt', {
        title: _('Back up and Restore').t(),
        destroyOnHide: true,
        type: 'wide'
    }, $);
    $(myModal.$el).on("hide", function() {
        // Not taking any action on hide, but you can if you want to!
    })
    $(myModal.$el).css("width", "900px")
    $(myModal.$el).css("margin-left", "-450px")

    let body = $("<div>").append($('<p>' + _('Manage Splunk Security Essentials bookmarks and custom content. You can back up, restore, or export your configurations. Backups are stored in the sse_bookmark_backup.csv lookup.').t() + '</p>'),
        $('<p>' + _(' By default, backups include Bookmarks, Custom Content, Local Search Mappings, and Data Inventory.').t() + '</p>'),
        $('<button style="" class="btn">' + _('Reset Configurations').t() + '</button>').click(function() {
            $(".modal,.modal-backdrop").remove()
            clearBookmarkList();
        }),
        $('<button style="margin-left: 8px;" class="btn">' + _('Back up Current Configurations').t() + '</button>').click(function() {
            $(".modal,.modal-backdrop").remove()
            snapshotBookmarkList();
        }),
        $('<button style="margin-left: 8px;" class="btn">' + _('Import New Backup').t() + '</button>').click(function() {
            $(".modal,.modal-backdrop").remove()
            importBookmarkList();
        }),
        $('<button style="margin-left: 8px;" class="btn btn-primary">' + _('Manage and Restore Backups').t() + '</button>').click(function() {
            $(".modal,.modal-backdrop").remove()
            restoreBookmarkList();
        }))
    myModal.body.html(body)



    myModal.footer.append($('<button>').attr({
        type: 'button',
        'data-dismiss': 'modal',
        'data-bs-dismiss': 'modal'
    }).addClass('btn btn-primary ').text(_('Close').t()).on('click', function() {

    }))
    myModal.show()
}
function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}
function b64DecodeUnicode(str) {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
function importBookmarkList() {

    require([
            "jquery",
            "underscore",
            "splunkjs/mvc/utils",
            "splunkjs/mvc/searchmanager",
            "components/controls/Modal"
        ],
        function(
            $,
            _,
            utils,
            SearchManager,
            Modal
        ) {


            if ($("#importSnapshot").length > 0) {
                $("#importSnapshot").remove()
            }
            let myModal = new Modal('importSnapshot', {
                title: 'Import New Backup'
            }, $);
            $(myModal.$el).on("hide", function() {
                // Not taking any action on hide, but you can if you want to!
            })

            let body = $('<p>' + _('Use the Manage and Restore Backups page to export or restore a backup (base64 encoded JSON). To import a backup, enter it in the following box and click Import.').t() + '</p><div id=\"importStatus\"><textarea id=\"importSnapshotBlob\" /></textarea></div>')

            myModal.body.html(body)



            myModal.footer.append($('<button>').attr({
                type: 'button',
                'data-dismiss': 'modal',
                'data-bs-dismiss': 'modal',
            }).addClass('btn ').text('Cancel').on('click', function() {

            }), $('<button>').attr({
                type: 'button'
            }).addClass('btn btn-primary disabled').attr("id", "buttonForImport").text('Import').attr("disabled", "disabled").on('click', function() {
                //console.log("Got the import request!", $("#importSnapshotBlob").val())
                let base64blob = $("#importSnapshotBlob").val().replace(/[^a-zA-Z0-9=\/\+]/g, "")
                let jsonBlob = ""
                let output = ""

                try {
                    jsonBlob = b64DecodeUnicode(base64blob);

                    try {
                        output = JSON.parse(jsonBlob);
                        var requiredFields = ["user", "num_mappings", "num_bookmarks", "num_custom_items", "num_data_source_categories_items", "num_mappings", "num_products_items"]; 
                        for(let i = 0; i < requiredFields.length; i++){ 
                            if(! output[requiredFields[i]]){ 
                                output[requiredFields[i]] = 0
                            } 
                        }
                        let rowID = (Math.random() * 100000000000000000).toString(16)
                        let searchString = '| makeresults | eval id="' + rowID + '", user="' + output['user'].replace(/"/g, "") + '", snapshot_name="' + output['name'].replace(/"/g, "\\\"") + '", num_bookmarks=' + output['num_bookmarks'] + 
                                            ', num_custom_items=' + output['num_custom_items'] + 
                                            ', num_mappings=' + output['num_mappings'] + 
                                            ', num_data_source_categories_items=' + output['num_data_source_categories_items'] + 
                                            ', num_products_items=' + output['num_products_items'] + ', json="' + JSON.stringify(output['json']).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\|/g, '\\|') + '" | outputlookup append=t sse_bookmark_backup'

                        if (typeof splunkjs.mvc.Components.getInstance("importSnapshotSearch_" + rowID) == "object") {
                            splunkjs.mvc.Components.revokeInstance("importSnapshotSearch_" + rowID)
                        }
                        let importSnapshotSearch = new SearchManager({
                            "id": "importSnapshotSearch_" + rowID,
                            "cancelOnUnload": true,
                            "latest_time": "0",
                            "sample_ratio": null,
                            "status_buckets": 0,
                            "autostart": true,
                            "earliest_time": "now",
                            "search": searchString,
                            "app": utils.getCurrentApp(),
                            "auto_cancel": 90,
                            "preview": true,
                            "runWhenTimeIsUndefined": false
                        }, { tokens: false });

                        importSnapshotSearch.on('search:fail', function(properties) {
                            $("#importStatus").html('<h3>' + _('Error!').t() + '</h3><p>' + _('Unknown error adding the backup to the lookup.').t() + '</p>')
                        })

                        importSnapshotSearch.on('search:done', function(properties) {

                            $(".modal,.modal-backdrop").remove()
                            let myModal = new Modal('importSnapshotSuccess', {
                                title: _('Import Backup Success').t()
                            }, $);
                            $(myModal.$el).on("hide", function() {
                                // Not taking any action on hide, but you can if you want to!
                            })

                            let body = $('<p>' + Splunk.util.sprintf(_('Success! Imported backup \"%s.\" It is now added to your Backups list.').t(), output['name']) + '</p>')

                            myModal.body.html(body)
                            myModal.footer.append($('<button>').attr({
                                type: 'button',
                                'data-dismiss': 'modal'
                            }).addClass('btn ').text( _('Close All').t() ).on('click', function() {
                                $(".modal,.modal-backdrop").remove()
                                $('[data-bs-dismiss=modal').click()
                            }), $('<button>').attr({
                                type: 'button',
                                'data-dismiss': 'modal'
                            }).addClass('btn btn-primary').text( _('Restore Backups').t() ).on('click', function() {
                                $(".modal,.modal-backdrop").remove()
                                restoreBookmarkList()
                                $('[data-bs-dismiss=modal').click()
                            }))
                            myModal.show()
                        })

                        importSnapshotSearch.on('search:error', function(properties) {
                            $("#importStatus").html('<h3>' + _('Error!').t() + '</h3><p>' + _('Unknown error adding the backup to the lookup.').t() + '</p>')
                        })

                        importSnapshotSearch.on('search:cancel', function(properties) {
                            $("#importStatus").html('<h3>' + _('Error!').t() + '</h3><p>' + _('Unknown error adding the backup to the lookup.').t() + '</p>')
                        })



                    } catch (err) {

                        $(".modal,.modal-backdrop").remove()
                        let myModal = new Modal('restoreSnapshotError2', {
                            title: _('Error Parsing').t(),
                            destroyOnHide: true
                        }, $);
                        myModal.body.html('<p>' + _('We received an error when trying to parse this -- after base64 decoding, it appears to not be a valid JSON output. Please ensure that you have the entire string pasted into this box.').t() + '</p><h3>' + _('Error').t() + '</h3><pre>' + err.message + "</pre><h3>Decoded JSON</h3><pre>" + jsonBlob + "</pre>")
                        myModal.footer.append($('<button>').attr({
                            type: 'button',
                            'data-dismiss': 'modal',
                            'data-bs-dismiss': 'modal'
                        }).addClass('btn btn-primary').text('Close'))
                        myModal.show()
                    }
                } catch (err) {

                    $(".modal,.modal-backdrop").remove()
                    let myModal = new Modal('restoreSnapshotError1', {
                        title: 'Error Parsing',
                        destroyOnHide: true
                    }, $);
                    myModal.body.html('<p>' + _('We received an error when trying to parse this -- it appears to not be a valid base64 encoded string. Please ensure that you have the entire string pasted into this box.').t() + '</p><h3>' + _('Error').t() + '</h3><pre>' + err.message + "</pre>")
                    myModal.footer.append($('<button>').attr({
                        type: 'button',
                        'data-dismiss': 'modal',
                        'data-bs-dismiss': 'modal'
                    }).addClass('btn btn-primary').text('Close'))
                    myModal.show()
                }
                // console.log("Here is our thing", output)
            }))
            myModal.show()

            $("#importSnapshotBlob").on("keyup change", function(evt) {
                setTimeout(function() {
                    if ($("#importSnapshotBlob").val().length > 0) {
                        $("#buttonForImport").removeAttr("disabled").removeClass("disabled");
                    } else {
                        $("#buttonForImport").attr("disabled", "disabled").addClass("disabled");
                    }
                }, 100)
            })
        })
}

function restoreBookmarkList() {

    require([
            "jquery",
            "underscore",
            "splunkjs/mvc/utils",
            "splunkjs/mvc/searchmanager",
            "components/controls/Modal"
        ],
        function(
            $,
            _,
            utils,
            SearchManager,
            Modal
        ) {

            let myModal = new Modal('restoreSnapshot', {
                title: _('Manage and Restore Backups').t(),
                destroyOnHide: true
            }, $);
            $(myModal.$el).addClass("modal-extra-wide").on("hide", function() {
                // Not taking any action on hide, but you can if you want to!
            })

            let body = $('<p>' + _('The following list includes all existing backups. Click Restore to select a backup from the list as the current backup.').t() + '</p><div id=\"listOfSnapshots\"><h3>' + _('Processing...').t() + '</h3>')

            myModal.body.html(body)



            myModal.footer.append($('<button>').attr({
                type: 'button',
                'data-dismiss': 'modal',
                'data-bs-dismiss': 'modal'
            }).addClass('btn ').text('Close').on('click', function() {

            }))
            myModal.show()


            let searchString = "| inputlookup sse_bookmark_backup | eval time=_time | convert ctime(time)"

            if (typeof splunkjs.mvc.Components.getInstance("snapshotCollectSearch") == "object") {
                splunkjs.mvc.Components.revokeInstance("snapshotCollectSearch")
            }
            let snapshotCollectSearch = new SearchManager({
                "id": "snapshotCollectSearch",
                "cancelOnUnload": true,
                "latest_time": "0",
                "sample_ratio": null,
                "status_buckets": 0,
                "autostart": true,
                "earliest_time": "now",
                "search": searchString,
                "app": utils.getCurrentApp(),
                "auto_cancel": 90,
                "preview": true,
                "runWhenTimeIsUndefined": false
            }, { tokens: false });


            snapshotCollectSearch.on('search:done', function(properties) {


                let SearchID = properties.content.request.label
                if (properties.content.resultCount == 0) {
                    $("#listOfSnapshots").html('<h3>' + _('No Backups Found').t() + '</h3>')
                } else {
                    var results = splunkjs.mvc.Components.getInstance(SearchID).data('results', { output_mode: 'json', count: 0 });
                    results.on("data", function(properties) {
                        var SearchID = properties.attributes.manager.id
                        var data = properties.data().results
                        let table = $('<table id="snapshotList" class="table table-striped"><thead><tr><th>' + _('Backup Name').t() + '</th><th>' + _('Backup date').t() + '</th><th>' + _('User').t() + '</th>' + 
                                            '<th>' + _('# Bookmarks').t() + '</th>' + '<th>' + _('# Custom Items').t() + '</th>' + 
                                            '<th>' + _('# Mappings').t() + '</th>' + '<th>' + _('Includes Data Inventory?').t() + '</th>' + 
                                            '<th>' + _('Export').t() + '</th><th>' + _('Restore').t() + '</th><th>' + _('Delete').t() + '</th></tr></thead><tbody></tbody></table>')
                        let tbody = table.find("tbody")
                            // console.log("Got my data!", data)
                        for (let i = 0; i < data.length; i++) {
                            let row = $("<tr>").attr("data-rowid", data[i]['id']).attr("data-json", data[i]['json'])
                            row.append($('<td class="snapshot-name">').text(data[i]['snapshot_name']))
                            row.append($('<td class="snapshot-time">').text(data[i]['time']))
                            row.append($('<td class="snapshot-user">').text(data[i]['user']))
                            row.append($('<td class="snapshot-num_bookmarks">').text(data[i]['num_bookmarks']))
                            row.append($('<td class="snapshot-num_custom_items">').text(data[i]['num_custom_items']))
                            row.append($('<td class="snapshot-num_mappings">').text(data[i]['num_mappings']))
                            let distatus = ""
                            if(data[i]['num_data_source_categories_items'] + data[i]['num_products_items'] > 0){
                                distatus = $('<i class="icon-check" />')
                            }
                            row.append($('<td class="snapshot-data-inventory">').attr("data-dscs", data[i]['num_data_source_categories_items'])
                                        .attr("data-products", data[i]['num_products_items']).html(distatus))
                            
                            row.append($('<td class="snapshot-">').html($('<i class="icon-export" style="cursor: pointer;">').click(function(evt) {
                                let target = $(evt.target);
                                let row = target.closest("tr");
                                let output = {}
                                output["name"] = row.find(".snapshot-name").text()
                                output["time"] = row.find(".snapshot-time").text()
                                output["user"] = row.find(".snapshot-user").text()
                                output["num_bookmarks"] = row.find(".snapshot-num_bookmarks").text()
                                output["num_custom_items"] = row.find(".snapshot-num_custom_items").text()
                                output["num_mappings"] = row.find(".snapshot-num_mappings").text()
                                output["num_data_source_categories_items"] = row.find(".snapshot-data-inventory").attr("data-dscs")
                                output["num_products_items"] = row.find(".snapshot-data-inventory").attr("data-products")
                                output["json"] = JSON.parse(target.closest("tr").attr("data-json").replace(/\\\|/g, "|"))
                                let base64Output = b64EncodeUnicode(JSON.stringify(output))
                                    // console.log("Got a request to restore", target.closest("tr").attr("data-rowid"), output, base64Output, target.closest("tr").html())

                                let myModal = new Modal('snapshotJSON', {
                                    title: _('Export a Backup').t(),
                                    destroyOnHide: true
                                }, $);
                                $(myModal.$el).on("hide", function() {
                                    // Not taking any action on hide, but you can if you want to!
                                })

                                let body = $("<div>")
                                body.append('<p>' + _('The following includes the content of this backup export, which is a JSON output encoded as base64. You can import this export into a Splunk Security Essentials instance by copying and pasting it into the Import Backup screen.').t() + '</p>')
                                body.append($('<textarea id="importSnapshotBlob" />').text(base64Output))
                                body.append($('<a href="#" style="margin-left: 2%;">' + _('Copy Export').t() + '</a>').click(function() {
                                    var copyText = document.getElementById("importSnapshotBlob");
                                    copyText.select();
                                    document.execCommand("copy");
                                }))
                                myModal.body.html(body)



                                myModal.footer.append($('<button>').attr({
                                    type: 'button',
                                    'data-dismiss': 'modal',
                                    'data-bs-dismiss': 'modal'
                                }).addClass('btn ').text('Close').on('click', function() {

                                }))
                                myModal.show()
                            })))
                            row.append($("<td>").append($("<button class=\"btn\">").text( _("Restore").t() ).click(function(evt) {
                                let target = $(evt.target);
                                // console.log("Got a request to restore", target.closest("tr").attr("data-rowid"), target.closest("tr").html())
                                window.dvtest = target.closest("tr").attr("data-json")
                                                                window.currentQueuedJSONReplacement = JSON.parse(target.closest("tr").attr("data-json").replace(/\\\|/g, "|"))


                                let actuallyDoTheClearing = $.Deferred();
                                $.when(actuallyDoTheClearing).then(function(existingData, includeBookmarks, includeCustom, includeMappings, includeDSCs, includeProducts) {
                                    let readyToAddBookmarks = $.Deferred()
                                    let readyToAddCustom = $.Deferred()
                                    let readyToAddMappings = $.Deferred()
                                    let readyToAddDSCs = $.Deferred()
                                    let readyToAddProducts = $.Deferred()
                                    // console.log("Clearing", existingData, includeBookmarks, includeCustom, includeMappings, includeDSCs, includeProducts)

                                    $("#listOfSnapshots").html('<table class="table"><thead><tr><th>' + _('Step').t() + '</th><th>' + _('Status').t() + '</th></thead><tbody>' + 
                                    '<tr><td>' + _('Bookmarks').t() + '</td><td id="bookmarkStatus"></td></tr>' + 
                                    '<tr><td>' + _('Custom Content').t() + '</td><td id="customBookmarkStatus"></td></tr>' + 
                                    '<tr><td>' + _('Local Search Mappings').t() + '</td><td id="mappingStatus"></td></tr>' + 
                                    '<tr><td>' + _('Data Inventory - Data Source Categories').t() + '</td><td id="dscStatus"></td></tr>' + 
                                    '<tr><td>' + _('Data Inventory - Products').t() + '</td><td id="productStatus"></td></tr>' + 
                                    '</tbody></table>')

                                    if (includeBookmarks) {
                                        if (existingData) {
                                            $.ajax({
                                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark',
                                                type: 'DELETE',
                                                headers: {
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                    'X-Splunk-Form-Key': window.getFormKey(),
                                                },
                                                async: true,
                                                success: function(returneddata) {
                                                    readyToAddBookmarks.resolve()
                                                },
                                                error: function(xhr, textStatus, error) {

                                                    let myModal = new Modal('clearConfirmed', {
                                                        title: 'Error!',
                                                        destroyOnHide: true,
                                                        type: 'wide'
                                                    }, $);
                                                    myModal.body.html($("<div>").append($('<p>' + _('Error clearing existing bookmarks before adding new ones.').t() + '</p>'), $("<pre>").text(textStatus)))
                                                    myModal.footer.append($('<button>').attr({
                                                        type: 'button',
                                                        'data-dismiss': 'modal',
                                                        'data-bs-dismiss': 'modal'
                                                    }).addClass('btn btn-primary ').text('Close'))
                                                    myModal.show()
                                                }
                                            })
                                        } else {
                                            readyToAddBookmarks.resolve()
                                        }
                                    } else {
                                        $("#bookmarkStatus").attr("status", "success").attr("data-working", "no").text( _("N/A").t() )
                                    }
                                    if (includeCustom) {
                                                                                if (existingData) {

                                            $.ajax({
                                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content',
                                                type: 'DELETE',
                                                headers: {
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                    'X-Splunk-Form-Key': window.getFormKey(),
                                                },
                                                async: true,
                                                success: function(returneddata) {
                                                    readyToAddCustom.resolve()
                                                },
                                                error: function(xhr, textStatus, error) {

                                                    let myModal = new Modal('clearConfirmed', {
                                                        title: 'Error!',
                                                        destroyOnHide: true,
                                                        type: 'wide'
                                                    }, $);
                                                    myModal.body.html($("<div>").append($('<p>' + _('Error clearing existing bookmarks before adding new ones.').t() + '</p>'), $("<pre>").text(textStatus)))
                                                    myModal.footer.append($('<button>').attr({
                                                        type: 'button',
                                                        'data-dismiss': 'modal',
                                                        'data-bs-dismiss': 'modal'
                                                    }).addClass('btn btn-primary ').text('Close'))
                                                    myModal.show()
                                                }
                                            })
                                        } else {
                                            readyToAddCustom.resolve()
                                        }
                                    } else {
                                        $("#customBookmarkStatus").attr("status", "success").attr("data-working", "no").text( _("N/A").t() )
                                    }
                                    if (includeMappings) {
                                        if (existingData) {
                                            $.ajax({
                                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings',
                                                type: 'DELETE',
                                                headers: {
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                    'X-Splunk-Form-Key': window.getFormKey(),
                                                },
                                                async: true,
                                                success: function(returneddata) {
                                                    readyToAddMappings.resolve()
                                                },
                                                error: function(xhr, textStatus, error) {

                                                    let myModal = new Modal('clearConfirmed', {
                                                        title: 'Error!',
                                                        destroyOnHide: true,
                                                        type: 'wide'
                                                    }, $);
                                                    myModal.body.html($("<div>").append($('<p>' + _('Error clearing existing local search mappings before adding new ones.').t() + '</p>'), $("<pre>").text(textStatus)))
                                                    myModal.footer.append($('<button>').attr({
                                                        type: 'button',
                                                        'data-dismiss': 'modal',
                                                        'data-bs-dismiss': 'modal'
                                                    }).addClass('btn btn-primary ').text('Close'))
                                                    myModal.show()
                                                }
                                            })
                                        } else {
                                            readyToAddMappings.resolve()
                                        }
                                    } else {
                                        $("#mappingStatus").attr("status", "success").attr("data-working", "no").text( _("N/A").t() )
                                    }
                                    if (includeDSCs) {
                                        if (existingData) {
                                            $.ajax({
                                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
                                                type: 'DELETE',
                                                headers: {
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                    'X-Splunk-Form-Key': window.getFormKey(),
                                                },
                                                async: true,
                                                success: function(returneddata) {
                                                    readyToAddDSCs.resolve()
                                                },
                                                error: function(xhr, textStatus, error) {

                                                    let myModal = new Modal('clearConfirmed', {
                                                        title: 'Error!',
                                                        destroyOnHide: true,
                                                        type: 'wide'
                                                    }, $);
                                                    myModal.body.html($("<div>").append($('<p>' + _('Error clearing existing data source categories before adding new ones.').t() + '</p>'), $("<pre>").text(textStatus)))
                                                    myModal.footer.append($('<button>').attr({
                                                        type: 'button',
                                                        'data-dismiss': 'modal',
                                                        'data-bs-dismiss': 'modal'
                                                    }).addClass('btn btn-primary ').text('Close'))
                                                    myModal.show()
                                                }
                                            })
                                        } else {
                                            readyToAddDSCs.resolve()
                                        }
                                    } else {
                                        $("#dscStatus").attr("status", "success").attr("data-working", "no").text( _("N/A").t() )
                                    }
                                    if (includeProducts) {
                                        if (existingData) {
                                            $.ajax({
                                                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
                                                type: 'DELETE',
                                                headers: {
                                                    'X-Requested-With': 'XMLHttpRequest',
                                                    'X-Splunk-Form-Key': window.getFormKey(),
                                                },
                                                async: true,
                                                success: function(returneddata) {
                                                    readyToAddProducts.resolve()
                                                },
                                                error: function(xhr, textStatus, error) {

                                                    let myModal = new Modal('clearConfirmed', {
                                                        title: 'Error!',
                                                        destroyOnHide: true,
                                                        type: 'wide'
                                                    }, $);
                                                    myModal.body.html($("<div>").append($('<p>' + _('Error clearing existing data inventory products before adding new ones.').t() + '</p>'), $("<pre>").text(textStatus)))
                                                    myModal.footer.append($('<button>').attr({
                                                        type: 'button',
                                                        'data-dismiss': 'modal',
                                                        'data-bs-dismiss': 'modal'
                                                    }).addClass('btn btn-primary ').text('Close'))
                                                    myModal.show()
                                                }
                                            })
                                        } else {
                                            readyToAddProducts.resolve()
                                        }
                                    } else {
                                        $("#productStatus").attr("status", "success").attr("data-working", "no").text( _("N/A").t() )
                                    }





                                    $.when(readyToAddBookmarks).then(function() {
                                        addBookmarks()
                                        // popAndAddFirstBookmark()
                                    })
                                    $.when(readyToAddCustom).then(function() {
                                        // popAndAddFirstCustomContent()
                                        // popAndAddFirstCustomBookmark()
                                                                                addCustomBookmarks();
                                        addCustomContent();
                                    })
                                    $.when(readyToAddMappings).then(function() {

                                        addMappings() // TODO
                                    })
                                    $.when(readyToAddDSCs).then(function() {

                                        addDSCs() // TODO
                                    })
                                    $.when(readyToAddProducts).then(function() {

                                        addProducts() // TODO
                                    })
                                        // console.log("Restoring with ", window.currentQueuedJSONReplacement)
                                })

                                let bookmarkDeferral = $.Deferred();
                                let custombookmarksDeferral = $.Deferred();
                                let mappingsDeferral = $.Deferred();
                                let dscsDeferral = $.Deferred();
                                let productsDeferral = $.Deferred();                

                                $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark',
                                    type: 'GET',
                                    contentType: "application/json",
                                    async: true,
                                    success: function(returneddata) {
                                        bookmarkDeferral.resolve(returneddata);
                                    },
                                    error: function() { bookmarkDeferral.resolve([]) }
                                })

                                $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content',
                                    type: 'GET',
                                    contentType: "application/json",
                                    async: true,
                                    success: function(returneddata) {
                                        custombookmarksDeferral.resolve(returneddata);
                                    },
                                    error: function() { custombookmarksDeferral.resolve([]) }
                                })


                                $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings',
                                    type: 'GET',
                                    contentType: "application/json",
                                    async: true,
                                    success: function(returneddata) {
                                        mappingsDeferral.resolve(returneddata);
                                    },
                                    error: function() { mappingsDeferral.resolve([]) }
                                })


                                $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
                                    type: 'GET',
                                    contentType: "application/json",
                                    async: true,
                                    success: function(returneddata) {
                                        dscsDeferral.resolve(returneddata);
                                    },
                                    error: function() { dscsDeferral.resolve([]) }
                                })


                                $.ajax({
                                    url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
                                    type: 'GET',
                                    contentType: "application/json",
                                    async: true,
                                    success: function(returneddata) {
                                        productsDeferral.resolve(returneddata);
                                    },
                                    error: function() { productsDeferral.resolve([]) }
                                })

                                $.when(bookmarkDeferral, custombookmarksDeferral, mappingsDeferral, dscsDeferral, productsDeferral).then(function(bookmarks, customBookmarks, mappings, dscs, products) {
                                    if (bookmarks.length > 0 || customBookmarks.length > 0) {

                                        let myModal = new Modal('confirmOverwrite', {
                                            title: _('Confirm').t(),
                                            destroyOnHide: true,
                                            type: 'wide'
                                        }, $);
                                        myModal.body.html($("<div>").append($('<p>' + _('Are you sure you want to overwrite the current configurations?').t() + '</p>')))
                                        myModal.body.append($('<label style="display: inline" for="restoreBookmarks">' + _('Include Bookmarks').t() + ': </label><input style="display: inline" type="checkbox" id="restoreBookmarks" checked>'))
                                        myModal.body.append($('<br />'))
                                        myModal.body.append($('<label style="display: inline" for="restoreCustomContent">' + _('Include Custom Content').t() + ': </label><input style="display: inline" type="checkbox" id="restoreCustomContent" checked>'))
                                        myModal.body.append($('<br />'))
                                        myModal.body.append($('<label style="display: inline" for="restoreMappings">' + _('Include Saved Search Mappings').t() + ': </label><input style="display: inline" type="checkbox" id="restoreMappings" checked>'))
                                        myModal.body.append($('<br />'))
                                        myModal.body.append($('<label style="display: inline" for="restoreDataInventory">' + _('Include Data Inventory').t() + ': </label><input style="display: inline" type="checkbox" id="restoreDataInventory" checked>'))
                                        myModal.footer.append($('<button>').attr({
                                            type: 'button',
                                            'data-dismiss': 'modal',
                                            'data-bs-dismiss': 'modal'
                                        }).addClass('btn ').text('Cancel'), $('<button>').attr({
                                            type: 'button',
                                            'data-dismiss': 'modal'
                                        }).addClass('btn btn-primary ').text('Confirm').click(function() {
                                            actuallyDoTheClearing.resolve(true, $("#restoreBookmarks").is(":checked"), $("#restoreCustomContent").is(":checked"), $("#restoreMappings").is(":checked"), $("#restoreDataInventory").is(":checked"))
                                            $('[data-bs-dismiss=modal').click()
                                            location.reload();
                                        }))
                                        myModal.show()

                                    } else {
                                        actuallyDoTheClearing.resolve(false, true, true, true, true, true)
                                    }
                                })



                            })))
                            row.append($("<td>").append($("<i class=\"icon-close\">").css("cursor", "pointer").click(function(evt) {
                                let target = $(evt.target);
                                // console.log("Got a request to delete", target.closest("tr").attr("data-rowid"))


                                let searchString = "| inputlookup sse_bookmark_backup | where id!=\"" + target.closest("tr").attr("data-rowid") + "\"| outputlookup sse_bookmark_backup"

                                if (typeof splunkjs.mvc.Components.getInstance("deleteSnapshotSearch_" + target.closest("tr").attr("data-rowid")) == "object") {
                                    splunkjs.mvc.Components.revokeInstance("deleteSnapshotSearch_" + target.closest("tr").attr("data-rowid"))
                                }
                                let deleteSnapshotSearch = new SearchManager({
                                    "id": "deleteSnapshotSearch_" + target.closest("tr").attr("data-rowid"),
                                    "cancelOnUnload": true,
                                    "latest_time": "0",
                                    "sample_ratio": null,
                                    "status_buckets": 0,
                                    "autostart": true,
                                    "earliest_time": "now",
                                    "search": searchString,
                                    "app": utils.getCurrentApp(),
                                    "auto_cancel": 90,
                                    "preview": true,
                                    "runWhenTimeIsUndefined": false
                                }, { tokens: false });

                                deleteSnapshotSearch.on('search:fail', function(properties) {
                                    $("#listOfSnapshots").html("<h3>Error!</h3><p>Unknown error deleting backup.</p>")
                                })

                                deleteSnapshotSearch.on('search:done', function(properties) {
                                    let SearchID = properties.content.request.label
                                        // console.log("Deletion Complete!", SearchID, properties)
                                    $("tr[data-rowid=\"" + SearchID.replace(/.*?\_/, "") + "\"]").remove()
                                    if ($("#snapshotList").find("tbody").find("tr").length == 0) {
                                        $("#listOfSnapshots").html("<h3>No Backups Found</h3>")

                                    }
                                })

                                deleteSnapshotSearch.on('search:error', function(properties) {
                                    $("#listOfSnapshots").html("<h3>Error!</h3><p>Unknown error deleting backup.</p>")
                                })

                                deleteSnapshotSearch.on('search:cancel', function(properties) {
                                    $("#listOfSnapshots").html("<h3>Error!</h3><p>Unknown error deleting backup.</p>")
                                })
                            })))
                            tbody.append(row)
                        }
                        $("#listOfSnapshots").html(table)
                    })
                }
            })

            snapshotCollectSearch.on('search:fail', function(properties) {
                $("#listOfSnapshots").html("<h3>Error!</h3><p>Unknown error retrieving Bookmarks.</p>")
            })

            snapshotCollectSearch.on('search:error', function(properties) {
                $("#listOfSnapshots").html("<h3>Error!</h3><p>Unknown error retrieving Bookmarks.</p>")
            })

            snapshotCollectSearch.on('search:cancel', function(properties) {
                $("#listOfSnapshots").html("<h3>Error!</h3><p>Unknown error retrieving Bookmarks.</p>")
            })
        })
}


function snapshotBookmarkList() {

    require([
            "jquery",
            "underscore",
            "splunkjs/mvc/utils",
            "splunkjs/mvc/searchmanager",
            "components/controls/Modal"
        ],
        function(
            $,
            _,
            utils,
            SearchManager,
            Modal
        ) {


            let myModal = new Modal('confirmSnapshot', {
                title: 'Back up Configurations',
                destroyOnHide: true,
                type: 'wide'
            }, $);
            $(myModal.$el).on("hide", function() {
                // Not taking any action on hide, but you can if you want to!
            })
            let currentdate = new Date();
            let datetime = (currentdate.getMonth() + 1) + "/" +
                currentdate.getDate() + "/" +
                currentdate.getFullYear() + " " +
                currentdate.getHours() + ":" +
                currentdate.getMinutes() + ":" +
                currentdate.getSeconds();
            let body = $("<div>").append($("<p>Backup Name: </p>").append('<input class="input" id="snapshotName" value="' + datetime + '" />'), $("<br/>"), $('<div id="snapshotStatus">').append($('<button class="btn btn-primary">Back up Current Configurations</button>').click(function() {
                let name = $("#snapshotName").val()
                createBookmarkOfCurrentContent(name)

            })))
            myModal.body.html(body)



            myModal.footer.append($('<button>').attr({
                type: 'button',
                'data-dismiss': 'modal',
                'data-bs-dismiss': 'modal'
            }).addClass('btn ').text('Close').on('click', function() {

            }))
            myModal.show()
        })
}

function createBookmarkOfCurrentContent(name){

    require([
        "jquery",
        "underscore",
        "splunkjs/mvc/utils",
        "splunkjs/mvc/searchmanager"
    ],
    function(
        $,
        _,
        utils,
        SearchManager
    ) {
        
        let bookmarkDeferral = $.Deferred();
        let custombookmarksDeferral = $.Deferred();
        let mappingsDeferral = $.Deferred();
        let dscsDeferral = $.Deferred();
        let productsDeferral = $.Deferred();

        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark',
            type: 'GET',
            contentType: "application/json",
            async: true,
            success: function(returneddata) {
                bookmarkDeferral.resolve(returneddata);
                
            },
            error: function() { bookmarkDeferral.resolve([]) }
        })

        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content',
            type: 'GET',
            contentType: "application/json",
            async: true,
            success: function(returneddata) {
                custombookmarksDeferral.resolve(returneddata);
                
            },
            error: function() { custombookmarksDeferral.resolve([]) }
        })

        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings',
            type: 'GET',
            contentType: "application/json",
            async: true,
            success: function(returneddata) {
                mappingsDeferral.resolve(returneddata);
                
            },
            error: function() { mappingsDeferral.resolve([]) }
        })

        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
            type: 'GET',
            contentType: "application/json",
            async: true,
            success: function(returneddata) {
                dscsDeferral.resolve(returneddata);
                
            },
            error: function() { dscsDeferral.resolve([]) }
        })

        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
            type: 'GET',
            contentType: "application/json",
            async: true,
            success: function(returneddata) {
                productsDeferral.resolve(returneddata);
                
            },
            error: function() { productsDeferral.resolve([]) }
        })

        $.when(bookmarkDeferral, custombookmarksDeferral, mappingsDeferral, dscsDeferral, productsDeferral).then(function(bookmarks, customBookmarks, mappings, dscs, products) {
            
            
            let object = { "bookmarks": bookmarks, "customContent": customBookmarks, "mappings": mappings, "dscs": dscs, "products": products}
            let rowID = (Math.random() * 100000000000000000).toString(16)
            let searchString = '| makeresults | eval id="' + rowID + '", user="' + $C['USERNAME'].replace(/"/g, "") +
                '", snapshot_name="' + name.replace(/"/g, "\\\"") + '", num_bookmarks=' +
                bookmarks.length + ', num_custom_items=' + customBookmarks.length + ', num_mappings=' + mappings.length + 
                ', num_data_source_categories_items=' + dscs.length + ', num_products_items=' + products.length + ', json="' +
                JSON.stringify(object).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\|/g, '\\|') + '" | outputlookup append=t sse_bookmark_backup'
            // console.log("About to launch this search", searchString)
            $("#snapshotStatus").html("<h3>Processing</h3>")

            if (typeof splunkjs.mvc.Components.getInstance("snapshotSearch") == "object") {
                splunkjs.mvc.Components.revokeInstance("snapshotSearch")
            }
            let snapshotSearch = new SearchManager({
                "id": "snapshotSearch",
                "cancelOnUnload": true,
                "latest_time": "0",
                "sample_ratio": null,
                "status_buckets": 0,
                "autostart": true,
                "earliest_time": "now",
                "search": searchString,
                "app": utils.getCurrentApp(),
                "auto_cancel": 90,
                "preview": true,
                "runWhenTimeIsUndefined": false
            }, { tokens: false });


            snapshotSearch.on('search:done', function(properties) {
                $("#snapshotStatus").html("<h3>Complete!</h3><p>You may now close this dialog.</p>")
            })

            snapshotSearch.on('search:fail', function(properties) {
                $("#snapshotStatus").html("<h3>Error!</h3><p>Unknown error backing up Bookmarks.</p>")
            })

            snapshotSearch.on('search:error', function(properties) {
                $("#snapshotStatus").html("<h3>Error!</h3><p>Unknown error backing up Bookmarks.</p>")
            })

            snapshotSearch.on('search:cancel', function(properties) {
                $("#snapshotStatus").html("<h3>Error!</h3><p>Unknown error backing up Bookmarks.</p>")
            })

        })
    })
}

function clearBookmarkList() {
    let _ = require("underscore");
    let Modal = require("components/controls/Modal");
    let myModal = new Modal('confirmClear', {
        title: _('Reset Configurations').t(),
        destroyOnHide: true,
        type: 'wide'
    }, $);
    $(myModal.$el).on("hide", function() {
        // Not taking any action on hide, but you can if you want to!
    })
    window.includeBookmarks = true;
    window.includeCustom = true;
    window.includeMappings = true;
    window.includeDSCs = true;
    window.includeProducts = true;
    let body = $("<div>").append($("<p>" + _("Are you sure?").t() + "</p>"),
        $('<label style="display: inline" for="restoreBookmarks">' + _('Include Bookmarks').t() + ': </label>'),
        $('<input style="display: inline" type="checkbox" id="restoreBookmarks" checked>').on("click keypress", function() {
            if ($("#restoreBookmarks").is(":checked") == "on") {
                window.includeBookmarks = true;
            } else {
                window.includeBookmarks = false;
            }
        }),
        $('<br />'),
        $('<label style="display: inline" for="restoreCustomContent">' + _('Include Custom Content').t() + ': </label>'),
        $('<input style="display: inline" type="checkbox" id="restoreCustomContent" checked>').on("click keypress", function() {
            if ($("#restoreCustomContent").is(":checked") == "on") {
                window.includeCustom = true;
            } else {
                window.includeCustom = false;
            }
        }),
        $('<br />'),
        $('<label style="display: inline" for="restoreMappings">' + _('Include Local Mappings').t() + ': </label>'),
        $('<input style="display: inline" type="checkbox" id="restoreMappings" checked>').on("click keypress", function() {
            if ($("#restoreMappings").is(":checked") == "on") {
                window.includeMappings = true;
            } else {
                window.includeMappings = false;
            }
        }),
        $('<br />'),
        $('<label style="display: inline" for="restoreDSCs">' + _('Include Data Inventory').t() + ': </label>'),
        $('<input style="display: inline" type="checkbox" id="restoreDSCs" checked>').on("click keypress", function() {
            if ($("#restoreDSCs").is(":checked") == "on") {
                window.includeProducts = true;
                window.includeDSCs = true;
            } else {
                window.includeProducts = false;
                window.includeDSCs = false;
            }
        }))
    myModal.body.html(body)



    myModal.footer.append($('<button>').attr({
        type: 'button',
        'data-dismiss': 'modal',
        'data-bs-dismiss': 'modal'
    }).addClass('btn ').text( _('Cancel').t() ).on('click', function() {

    }), $('<button>').attr({
        type: 'button',
        'data-dismiss': 'modal'
    }).addClass('btn btn-primary ').text( _('Clear Configurations').t() ).on('click', function() {
        let restoreBookmarks = window.includeBookmarks
        let restoreCustom = window.includeCustom
        let restoreMappings = window.includeMappings
        let restoreDSCs = window.includeDSCs
        let restoreProducts = window.includeProducts
        // console.log("Got a clear request", restoreBookmarks, restoreCustom, restoreMappings, restoreDSCs, restoreProducts);
        let bookmarksDone = $.Deferred()
        let customDone = $.Deferred()
        let mappingsDone = $.Deferred()
        let dscsDone = $.Deferred()
        let productsDone = $.Deferred()
        if (restoreBookmarks) {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark',
                type: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                async: true,
                success: function(returneddata) {
                    bookmarksDone.resolve()
                    bustCache(); 
                },
                error: function(xhr, textStatus, error) {

                    let myModal = new Modal('clearConfirmed', {
                        title: 'Error!',
                        destroyOnHide: true,
                        type: 'wide'
                    }, $);
                    myModal.body.html($("<div>").append($("<p>Error Clearing Bookmarks</p>"), $("<pre>").text(textStatus)))
                    myModal.footer.append($('<button>').attr({
                        type: 'button',
                        'data-dismiss': 'modal'
                    }).addClass('btn btn-primary ').text('Close'))
                    myModal.show()
                }
            })
        } else {
            bookmarksDone.resolve()
        }
        if (restoreCustom) {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content',
                type: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                async: true,
                success: function(returneddata) {
                    customDone.resolve()
                    bustCache(); 
                },
                error: function(xhr, textStatus, error) {

                    let myModal = new Modal('clearConfirmed', {
                        title: 'Error!',
                        destroyOnHide: true,
                        type: 'wide'
                    }, $);
                    myModal.body.html($("<div>").append($( _("<p>Error Clearing Custom Content</p>").t() ), $("<pre>").text(textStatus)))
                    myModal.footer.append($('<button>').attr({
                        type: 'button',
                        'data-dismiss': 'modal'
                    }).addClass('btn btn-primary ').text( _('Close').t() ))
                    myModal.show()
                }
            })
        } else {
            customDone.resolve()
        }
        if (restoreMappings) {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings',
                type: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                async: true,
                success: function(returneddata) {
                    mappingsDone.resolve()
                    bustCache(); 
                },
                error: function(xhr, textStatus, error) {

                    let myModal = new Modal('clearConfirmed', {
                        title: 'Error!',
                        destroyOnHide: true,
                        type: 'wide'
                    }, $);
                    myModal.body.html($("<div>").append($( _("<p>Error Clearing Local Search Mappings</p>").t() ), $("<pre>").text(textStatus)))
                    myModal.footer.append($('<button>').attr({
                        type: 'button',
                        'data-dismiss': 'modal'
                    }).addClass('btn btn-primary ').text( _('Close').t() ))
                    myModal.show()
                }
            })
        } else {
            mappingsDone.resolve()
        }
        if (restoreDSCs) {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes',
                type: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                async: true,
                success: function(returneddata) {
                    dscsDone.resolve()
                    bustCache(); 
                },
                error: function(xhr, textStatus, error) {

                    let myModal = new Modal('clearConfirmed', {
                        title: 'Error!',
                        destroyOnHide: true,
                        type: 'wide'
                    }, $);
                    myModal.body.html($("<div>").append($( _("<p>Error Clearing Data Category Mappings</p>").t() ), $("<pre>").text(textStatus)))
                    myModal.footer.append($('<button>').attr({
                        type: 'button',
                        'data-dismiss': 'modal'
                    }).addClass('btn btn-primary ').text( _('Close').t() ))
                    myModal.show()
                }
            })
        } else {
            dscsDone.resolve()
        }
        if (restoreProducts) {
            $.ajax({
                url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products',
                type: 'DELETE',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-Splunk-Form-Key': window.getFormKey(),
                },
                async: true,
                success: function(returneddata) {
                    productsDone.resolve()
                    bustCache(); 
                },
                error: function(xhr, textStatus, error) {

                    let myModal = new Modal('clearConfirmed', {
                        title: 'Error!',
                        destroyOnHide: true,
                        type: 'wide'
                    }, $);
                    myModal.body.html($("<div>").append($( _("<p>Error Clearing Data Inventory Products</p>").t() ), $("<pre>").text(textStatus)))
                    myModal.footer.append($('<button>').attr({
                        type: 'button',
                        'data-dismiss': 'modal'
                    }).addClass('btn btn-primary ').text( _('Close').t() ))
                    myModal.show()
                }
            })
        } else {
            productsDone.resolve()
        }

        $.when(bookmarksDone, customDone, mappingsDone, dscsDone, productsDone).then(function() {

            let myModal = new Modal('clearConfirmed', {
                title: 'Complete',
                destroyOnHide: true,
                type: 'wide'
            }, $);

            $(myModal.$el).on("hide", function() {
                location.reload()
            })
            myModal.body.html($("<div>").append($( _("<p>Configurations have been cleared. This page will reload when you close this window.</p>").t() )))
            myModal.footer.append($('<button>').attr({
                type: 'button',
                'data-dismiss': 'modal'
            }).addClass('btn btn-primary ').text( _('Reload Page').t() ))
            myModal.show()
            // $(".modal:visible").on("hide", function() {
            // })
            location.reload()
        })
        $('[data-bs-dismiss=modal').click()
    }))
    myModal.show()
}


// function popAndAddFirstBookmark() {
//     if (window.currentQueuedJSONReplacement['bookmarks'] && window.currentQueuedJSONReplacement['bookmarks'].length > 0) {
//         record = window.currentQueuedJSONReplacement['bookmarks'].shift()
//         $.ajax({
//             url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/',
//             type: 'POST',
//             contentType: "application/json",
//             async: false,
//             data: JSON.stringify(record),
//             success: function(returneddata) {bustCache(); popAndAddFirstBookmark() },
//             error: function(xhr, textStatus, error) {}
//         })
//     } else {
//         $("#bookmarkStatus").attr("status", "complete").append($("<p>Success! Added all bookmarks</p>"))
//         markAllBookmarkRestorationComplete()
//     }
// }

// function popAndAddFirstCustomBookmark() {
//     if (window.currentQueuedJSONReplacement['customBookmarks'] && window.currentQueuedJSONReplacement['customBookmarks'].length > 0) {
//         record = window.currentQueuedJSONReplacement['customBookmarks'].shift()
//         $.ajax({
//             url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_custom/',
//             type: 'POST',
//             contentType: "application/json",
//             async: false,
//             data: JSON.stringify(record),
//             success: function(returneddata) {bustCache(); popAndAddFirstCustomBookmark() },
//             error: function(xhr, textStatus, error) {}
//         })
//     } else {
//         $("#customBookmarkStatus").attr("status", "complete").append($("<p>Success! Added all legacy custom content.</p>"))
//         markAllBookmarkRestorationComplete()
//     }
// }

// function popAndAddFirstCustomContent() {
//     if (window.currentQueuedJSONReplacement['customContent'] && window.currentQueuedJSONReplacement['customContent'].length > 0) {
//         record = window.currentQueuedJSONReplacement['customContent'].shift()
//         $.ajax({
//             url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/batch_save',
//             type: 'POST',
//             contentType: "application/json",
//             async: false,
//             data: JSON.stringify(record),
//             success: function(returneddata) {bustCache(); },
//             error: function(xhr, textStatus, error) {}
//         })
//     } else {
//         $("#customBookmarkStatus").attr("status", "complete").append($("<p>Success! Added all custom content.</p>"))
//         markAllBookmarkRestorationComplete()
//     }
// }


function markAllBookmarkRestorationComplete() {
    if ($("#bookmarkStatus").attr("status") == "complete" && $("#customBookmarkStatus").attr("status") == "complete" 
    && $("#mappingStatus").attr("status") == "complete" && $("#dscStatus").attr("status") == "complete" 
    && $("#productStatus").attr("status") == "complete") {
        $(".modal:visible").find(".modal-footer").find("button").text("Reload Page").addClass("btn-primary")
    location.reload()
    }
}


function addBookmarks(){ 
    if (window.currentQueuedJSONReplacement['bookmarks'] && window.currentQueuedJSONReplacement['bookmarks'].length > 0) {
        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark/batch_save',
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Splunk-Form-Key': window.getFormKey(),
            },
            contentType: "application/json",
            async: false,
            data: JSON.stringify(window.currentQueuedJSONReplacement['bookmarks']),
            success: function(returneddata) {
                $("#bookmarkStatus").attr("status", "complete").append($("<p>Success! Added all Local Search Mappings.</p>"))
                markAllBookmarkRestorationComplete();
                bustCache();
            },
            error: function(){
                $("#bookmarkStatus").attr("status", "error").append($("<p>Error adding the Local Search Mappings!.</p>"))
            }                    
        })
    }else{
        $("#bookmarkStatus").attr("status", "complete").append($("<p>No Local Search Mappings to add.</p>"))
        markAllBookmarkRestorationComplete()
    }

}
function addCustomBookmarks(){ 
    if (window.currentQueuedJSONReplacement['customBookmarks'] && window.currentQueuedJSONReplacement['customBookmarks'].length > 0) {
        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/bookmark_custom/batch_save',
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Splunk-Form-Key': window.getFormKey(),
            },
            contentType: "application/json",
            async: false,
            data: JSON.stringify(window.currentQueuedJSONReplacement['customBookmarks']),
            success: function(returneddata) {
                $("#customBookmarkStatus").attr("status", "complete").append($("<p>Success! Added all Local Search Mappings.</p>"))
                markAllBookmarkRestorationComplete()
                bustCache();
            },
            error: function(){
                $("#customBookmarkStatus").attr("status", "error").append($("<p>Error adding the Local Search Mappings!.</p>"))
            }                    
        })
    }else{
        $("#customBookmarkStatus").attr("status", "complete").append($("<p>No Local Search Mappings to add.</p>"))
        markAllBookmarkRestorationComplete()
    }

}

function addCustomContent(){ 
        if (window.currentQueuedJSONReplacement['customContent'] && window.currentQueuedJSONReplacement['customContent'].length > 0) {
                $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/custom_content/batch_save',
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Splunk-Form-Key': window.getFormKey(),
            },
            contentType: "application/json",
            async: false,
            data: JSON.stringify(window.currentQueuedJSONReplacement['customContent']),
            success: function(returneddata) {
                // console.log("Request succesful: ", returneddata);
                $("#customBookmarkStatus").attr("status", "complete").append($("<p>Success! Added all Local Search Mappings.</p>"))
                markAllBookmarkRestorationComplete()
                bustCache();
            },
            error: function(){
                $("#customBookmarkStatus").attr("status", "error").append($("<p>Error adding the Local Search Mappings!.</p>"))
            }                    
        })
    }else{
        $("#customBookmarkStatus").attr("status", "complete").append($("<p>No Local Search Mappings to add.</p>"))
        markAllBookmarkRestorationComplete()
    }

}

function addMappings(){ 
    if (window.currentQueuedJSONReplacement['mappings'] && window.currentQueuedJSONReplacement['mappings'].length > 0) {
        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/local_search_mappings/batch_save',
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Splunk-Form-Key': window.getFormKey(),
            },
            contentType: "application/json",
            async: false,
            data: JSON.stringify(window.currentQueuedJSONReplacement['mappings']),
            success: function(returneddata) {
                $("#mappingStatus").attr("status", "complete").append($("<p>Success! Added all Local Search Mappings.</p>"))
                markAllBookmarkRestorationComplete()
                bustCache();
            },
            error: function(){
                $("#mappingStatus").attr("status", "error").append($("<p>Error adding the Local Search Mappings!.</p>"))
            }                    
        })
    }else{
        $("#mappingStatus").attr("status", "complete").append($("<p>No Local Search Mappings to add.</p>"))
        markAllBookmarkRestorationComplete()
    }

}
function addDSCs(){
    if (window.currentQueuedJSONReplacement['dscs'] && window.currentQueuedJSONReplacement['dscs'].length > 0) {
        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_eventtypes/batch_save',
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Splunk-Form-Key': window.getFormKey(),
            },
            contentType: "application/json",
            async: false,
            data: JSON.stringify(window.currentQueuedJSONReplacement['dscs']),
            success: function(returneddata) {
                $("#dscStatus").attr("status", "complete").append($("<p>Success! Added all Data Source Categories.</p>"))
                markAllBookmarkRestorationComplete()
                bustCache();
            },
            error: function(){
                $("#dscStatus").attr("status", "error").append($("<p>Error adding the Data Source Categories!.</p>"))
            }                    
        })
    }else{
        $("#dscStatus").attr("status", "complete").append($("<p>No Data Source Categories to add.</p>"))
        markAllBookmarkRestorationComplete()
    }

}
function addProducts(){
    if (window.currentQueuedJSONReplacement['products'] && window.currentQueuedJSONReplacement['products'].length > 0) {
        $.ajax({
            url: $C['SPLUNKD_PATH'] + '/servicesNS/nobody/Splunk_Security_Essentials/storage/collections/data/data_inventory_products/batch_save',
            type: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Splunk-Form-Key': window.getFormKey(),
            },
            contentType: "application/json",
            async: false,
            data: JSON.stringify(window.currentQueuedJSONReplacement['products']),
            success: function(returneddata) {
                $("#productStatus").attr("status", "complete").append($("<p>Success! Added all Data Inventory Products.</p>"))
                markAllBookmarkRestorationComplete()
                bustCache();
            },
            error: function(){
                $("#productStatus").attr("status", "error").append($("<p>Error adding the data inventory products!.</p>"))
            }                    
        })
    }else{
        $("#productStatus").attr("status", "complete").append($("<p>No Data Inventory Products to add.</p>"))
        markAllBookmarkRestorationComplete()
    }
}
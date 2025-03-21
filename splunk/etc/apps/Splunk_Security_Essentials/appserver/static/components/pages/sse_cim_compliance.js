// console.log("Step 1")

require([
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/chartview',
    'splunkjs/mvc/searchmanager',
    'splunkjs/mvc',
    'underscore',
    'splunkjs/mvc/simplexml/ready!'],function(
    TableView,
    ChartView,
    SearchManager,
    mvc,
    _
    ){
        var CustomRangeRenderer = TableView.BaseCellRenderer.extend({
            canRender: function(cell) {
                return _(['termsearch', "allfields"]).contains(cell.field);
            },
            render: function($td, cell) {
                // console.log("cell render called", $td, cell);
                $($td).hide();
            }
        });
    var EventSearchBasedRowExpansionRenderer = TableView.BaseRowExpansionRenderer.extend({
        initialize: function(args) {
            // initialize will run once, so we will set up a search and a chart to be reused.
            this._searchManager = new SearchManager({
                id: 'details-search-manager',
                preview: false
            });
            this._tableView = new TableView({
                managerid: 'details-search-manager'
            });
            
        },
        canRender: function(rowData) {
            // Since more than one row expansion renderer can be registered we let each decide if they can handle that
            // data
            // Here we will always handle it.
            return true;
        },
        render: function($container, rowData) {
            // rowData contains information about the row that is expanded.  We can see the cells, fields, and values
            // We will find the sourcetype cell to use its value
            
            var termsearchCell = _(rowData.cells).find(function (cell) {
                return cell.field === 'termsearch';
             });
             var fieldsCell = _(rowData.cells).find(function (cell) {

                return cell.field === 'allfields';
             });
            //update the search with the sourcetype that we are interested in
            this._searchManager.set({ search: termsearchCell.value + ' earliest=-3d | head 10000 | fields - _* | fields ' + fieldsCell.value + ' | fieldsummary | fields field count distinct_count values | rex field=values mode=sed "s/\\},\\{/}, {/g"'});
            // $container is the jquery object where we can put out content.
            // In this case we will render our chart and add it to the $container
            $container.append(this._tableView.render().el);
        }
    });
    var tableElement = mvc.Components.getInstance("expand_with_events");
    tableElement.getVisualization(function(tableView) {
        // Add custom cell renderer, the table will re-render automatically.
        tableView.addRowExpansionRenderer(new EventSearchBasedRowExpansionRenderer());
        tableView.addCellRenderer(new CustomRangeRenderer());
    });

    setInterval(function(){

        $("th[data-sort-key=\"termsearch\"]:visible").hide();
        $("th[data-sort-key=\"allfields\"]:visible").hide();
    }, 400)
    $("#cim_doc_link").find("a").attr("href",window.makeHelpLinkURL("Splunk_Security_Essentials", "sseCimCompliance.cim.user.overview", "latest"))
});
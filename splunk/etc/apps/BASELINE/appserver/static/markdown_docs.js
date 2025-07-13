require([
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tokenutils',
    'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
], function($, mvc, TokenUtils) {
    'use strict';

    // Set up markdown rendering options
    marked.setOptions({
        gfm: true, // GitHub flavored markdown
        breaks: true, // Convert line breaks to <br>
        sanitize: false // Allow HTML in markdown
    });

    // Function to load and render markdown content
    function loadMarkdownContent(url) {
        if (!url || url === 'none') {
            $('#markdown-content').html('<h3>Please select a document from the dropdown above.</h3>');
            return;
        }

        // Show loading message
        $('#markdown-content').html('<p>Loading documentation...</p>');

        // Fetch markdown content
        $.ajax({
            url: url,
            dataType: 'text',
            success: function(data) {
                // Render markdown to HTML
                var htmlContent = marked.parse(data);
                $('#markdown-content').html(htmlContent);
            },
            error: function(xhr, status, error) {
                // Handle error
                $('#markdown-content').html(
                    '<div class="error-message">' +
                    '<h3>Error loading documentation</h3>' +
                    '<p>Could not load content from: ' + url + '</p>' +
                    '<p>Error: ' + error + '</p>' +
                    '</div>'
                );
            }
        });
    }

    // Set up token listeners
    var tokens = mvc.Components.get('default');
    if (tokens) {
        tokens.on('change:selected_doc', function(model, value) {
            loadMarkdownContent(value);
        });
        
        // Load initial content if token is already set
        var selectedDoc = tokens.get('selected_doc');
        if (selectedDoc) {
            loadMarkdownContent(selectedDoc);
        }
    }
});

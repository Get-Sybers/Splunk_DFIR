## MLTK Showcases

The MLTK Showcase is a set of example Assistant configurations used to demonstrate MLTK use-cases, organized by Assistant, with an additional filter for user role (e.g., Security or IoT).

### Adding Showcases to the MLTK

1. If your dataset is not already available, add it to `src/main/resources/splunk/lookups`.
    * if you do this, add documentation about this dataset to `src/main/resources/splunk/lookups/docs`
2. Generate a JSON object representing your showcase. If you're familar with the structure, you can do this manually, or you can follow the steps to generate this object in the [Generating a Showcase Using an Experiment] section below.
3. Once you have Showcase JSON, find the appropriate Showcase file here: `src/main/webapp/data/showcases`.
4. Add your Showcase JSON to that file under a key of your choice.
    * the key should be unique, unambigious, and 1-3 words long
5. Add the Showcase info to `src/main/webapp/data/showcaseInfo.json`.
    * add it to the `assistants.<YOUR_SHOWCASE>.examples` section
    * the key should be a snake-case version of your key from step 4
        * i.e., if  your key in step 4 was `My Showcase` your key in this file should be `my_showcase`
        * the `name` must be the same as the key from step 4
        * the `label` must match your `title` from the Showcase JSON file in step 4
6. Register your showcase to the desired roles - under `assistants.<YOUR_SHOWCASE>.showcases`, for each of the existing roles, add your key from step 5 to the `examples` list.
7. You're done! Rebuild the MLTK and your new Showcase should be visible on the `Showcases` page.

### Generating a Showcase Using an Experiment

If you don't want to generate your Experiment JSON yourself, you can use the MLTK Experiment UI to generate it.

1. Load the MLTK and navigate to the Experiments list.
2. Create a new Experiment.
    * make sure Experiment Type matches your desired Showcase
    * the Experiment Title will be your Showcase title
3. Fill in the desired fields in the Experiment.
4. Click the "Submit" button (i.e., "Fit Model", "Detect Outliers", etc.)
5. Validate the results - if the results aren't what you want, adjust your settings in step 4.
6. To generate Experiment JSON, you need to run some JS code in one of the two following ways:
    * Create a bookmarklet with the following code, then click it while on the Experiment page:

            javascript:void%20function(){$.ajax(window.location.origin+%22/en-US/splunkd/__raw/%22+decodeURIComponent(window.location.search).substr(14)).then(function(response){const%20parsed=JSON.parse(response),content=parsed.entry[0].content,showcase={title:content.title,type:content.type,dataSource:content.dataSource.length%3E0%3FJSON.parse(content.dataSource):%22%22,searchStages:content.searchStages.length%3E0%3FJSON.parse(content.searchStages):%22%22};window.open().document.body.innerHTML=%22%3Cpre%3E%22+JSON.stringify(showcase,null,4)+%22%3C/pre%3E%22})}();

    *  While on the Experiment page, open your JS console and paste in the following:

            $.ajax(window.location.origin + '/en-US/splunkd/__raw/' + decodeURIComponent(window.location.search).substr(14)).then(function (response) {
                const parsed = JSON.parse(response);
                const content = parsed.entry[0].content;
                const showcase = {
                    title: content.title,
                    type: content.type,
                    dataSource: content.dataSource.length > 0 ? JSON.parse(content.dataSource) : '',
                    searchStages: content.searchStages.length > 0 ? JSON.parse(content.searchStages) : ''
                };
                window.open().document.body.innerHTML = '<pre>' + JSON.stringify(showcase, null, 4) + '</pre>';
            });

7. Either way, a new window will open with your Showcase JSON - copy it to a tex editor.
8. In each of your SearchStages, rename your `modelName` if it exists
    * it's going to be based on the Experiment GUID, for example: `_exp_32c3418b9c6f4c4699e226c2df56a0a5`
    * replace it with a human-readable name starting with `example_`
    * i.e., if you intend to name your Showcase `My Showcase`, your model name should be `example_my_showcase`
    * for all `preprocessing` stages, keep the suffix - for example, `_exp_32c3418b9c6f4c4699e226c2df56a0a5_StandardScaler_0` should be replaced with `example_my_showcase_StandardScaler_0`
9. You can now use this JSON in the [Adding Showcases to the MLTK] section above.
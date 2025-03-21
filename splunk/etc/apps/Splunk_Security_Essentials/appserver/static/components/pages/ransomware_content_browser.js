require([
    'jquery',
    'splunkjs/mvc',
    "splunkjs/ready!",
], function($, mvc, Ready) {
    var defaultTokenModel = mvc.Components.get("default");
    let lineConfig = [
        {start:"phase_phishing",end:"phase_valid_credentials",tactic:"initial_access",lineConfig:getLineConfig("right","left","disc")},
        {start:"phase_valid_credentials",end:"phase_internet-exposed_service",tactic:"initial_access",lineConfig:getLineConfig("right","left")},
        {start:"phase_internet-exposed_service",end:"phase_command_and_control",tactic:"initial_access",lineConfig:getLineConfig("right","left")},
        {start:"phase_command_and_control",end:"phase_lateral_movement",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_command_and_control",end:"phase_privilege_escalation",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_lateral_movement",end:"phase_privilege_escalation",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("bottom","top")},
        {start:"phase_privilege_escalation",end:"phase_lateral_movement",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("top","bottom")},
        {start:"phase_lateral_movement",end:"phase_data_exfiltration",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_lateral_movement",end:"phase_destroy_backups",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_lateral_movement",end:"phase_encrypt_data",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_privilege_escalation",end:"phase_data_exfiltration",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_privilege_escalation",end:"phase_destroy_backups",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_privilege_escalation",end:"phase_encrypt_data",tactic:"consolidation_and_preparation",lineConfig:getLineConfig("right","left","behind","grid")},
        {start:"phase_password_guessing",end:"phase_valid_credentials",tactic:"initial_access",lineConfig:getLineConfig("right","bottom","disc")},
        {start:"phase_exploit_vulnerability",end:"phase_internet-exposed_service",tactic:"initial_access",lineConfig:getLineConfig("right","left","disc")},
        {start:"phase_email",end:"phase_malicious_document",tactic:"initial_access",lineConfig:getLineConfig("right","left","disc")},
        {start:"phase_malicious_document",end:"phase_malware",tactic:"initial_access",lineConfig:getLineConfig("right","left")},
        {start:"phase_malware",end:"phase_command_and_control",tactic:"initial_access",lineConfig:getLineConfig("right","left")},
        {start:"phase_data_exfiltration",tactic:"impact_on_target"},
        {start:"phase_destroy_backups",tactic:"impact_on_target"},
        {start:"phase_encrypt_data",tactic:"impact_on_target"}
    ]
    setTimeout(function(){
        lineConfig.forEach(function(line){
            if (typeof line.end != "undefined") {
                createLine(line.start,line.end,line.lineConfig);
            }
            $("#"+line.start).click(function() {
                defaultTokenModel.set("phase", formatPhaseName($(this).attr('id')));
                defaultTokenModel.set("form.phase", formatPhaseName($(this).attr('id')));
                $(".phase.selected").removeClass("selected")
                $(this).addClass("selected")
            });  
    });
    },500)

    defaultTokenModel.on("change:ready", function(model, tokHTML, options) {
        $(".phase.selected").removeClass("selected")
        if (!defaultTokenModel.get("phase").includes("*")) {
            convertTokenToHTMLPanel("description_phase",".phase_description")
            convertTokenToHTMLPanel("description_stage",".stage_description")
            //Set selected circle
            let phaseId=formatPhaseId(defaultTokenModel.get("phase"));
            $("#"+phaseId).addClass("selected")
        } else{
            //Clear descriptions
            $(".phase_description").empty();
            $(".stage_description").empty();
            $(".phase_title h2").empty();
            $(".stage_title h2").empty();
        }
        
    });

    function convertTokenToHTMLPanel(token, identifier) {
        let tokHTMLJS=defaultTokenModel.get(token);
        if (typeof tokHTMLJS != "undefined" && tokHTMLJS !="" && !tokHTMLJS.includes("$")) {
            $(identifier).html(tokHTMLJS);
        } else{
            $(identifier).html("");
        }
        
    }

    function getLineConfig(startSocket='auto', endSocket='auto', startPlug='behind', path='fluid') {
        let lineColor = 'rgba(243,152,154,255)'
        let lineConfig = {
            hide: false, 
            path: path, 
            startSocket: startSocket, 
            endSocket: endSocket, 
            endPlug: 'arrow2',
            startPlug: startPlug,
            positionByWindowResize: 'false', 
            color: lineColor,
            duration: 500, 
            timing: 'linear'
        }
        return lineConfig
    }

    function createLine(startId, endId, lineConfig) {
        let start = $("#"+startId + " circle")[0]
        let end = $("#"+endId + " circle")[0]
        if (start != null && end!= null) {
            let line = new LeaderLine(start, end, lineConfig);
        }
    }

    function formatPhaseName(phaseId) {
        let temp=phaseId.substring(6,1000).replace(/_/g," ")
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    }

    function formatPhaseId(phase) {
        let temp="phase_" + phase.replace(/ /g,"_").toLowerCase()
        return temp
    }

})
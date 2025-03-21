CAR_Object = Precoss
CAR_Action = Create

CAR_Field field alias mapping

Artefact.meta
    origin = workstation1
    time.ccollection = 20250101T00:00.00Z
    time.creation = 20190101T00:00.00Z
Artefact.source = file
    Artefact.source.type = Prefetch
    Artefact.source.fields
        ad_domain
        app_name
        auth_service
        auth_target
        decision_reason
        fqdn
        hostname
        method
        response_time
        target_ad_domain
        target_uid
        target_user
        target_user_role
        target_user_type
        uid
        user
        user_agent
        user_role
        user_type
Artefact.car-object = Process
    Artefact.car-object.action - create
    Artefact.car-object.fields
        access_level
        call_trace
        command_line
        current_working_directory
        env_vars
        exe
        fqdn
        guid
        hostname
        image_path
        integrity_level
        md5_hash
        parent_command_line
        parent_exe
        parent_guid
        parent_image_path
        pid
        ppid
        sha1_hash
        sha256_hash
        sid
        signature_valid
        signer
        target_address
        target_guid
        target_name
        target_pid
        uid
        user

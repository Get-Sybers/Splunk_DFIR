"""
REST handler for `upload_model` command
"""
from util.searchinfo_util import searchinfo_from_request
from util import onnx_util


class UploadModel(object):
    @classmethod
    def handle_post(cls, request, path_parts):
        """
        Handles POST requests

        Args:
            request: a dictionary providing information about the request
            path_parts: a list of strings describing the request path
        """
        try:
            searchinfo = searchinfo_from_request(request)
            # TODO: Create safe_handler to handle post request safely
            process_options = onnx_util.create_process_options_for_rest(
                request, searchinfo, process_options={}
            )
            response = onnx_util.validate_model_and_upload(process_options, searchinfo)
        except Exception as e:
            message = (
                f"{e} Error occurred while model upload. Please check mlspl.log for error logs "
            )
            error = onnx_util.ModelUploadResponse(message=message).get_response_error()
            return error
        # Return success or failure based on whether the model file is validated and verified.
        success = onnx_util.ModelUploadResponse(payload=response).get_response_success()
        return success

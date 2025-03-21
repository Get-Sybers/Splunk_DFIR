import sys
import onnx


def if_valid_onnx_model(file_path):
    try:
        if isinstance(file_path, str):
            model_file = onnx.load(file_path)
        elif isinstance(file_path, bytes):
            model_file = onnx.load_from_string(file_path)
        onnx.checker.check_model(model_file)
    except (OSError, IOError) as err:
        if err.errno == err.errno.ENOENT:
            raise RuntimeError(f'Model does not exist at {file_path}')
        raise RuntimeError(f'Failed to load model from {file_path}: {str(err)}')
    except Exception as err:
        raise RuntimeError(f"OnnxModelValidationError: {str(err)}")
    return True


if __name__ == "__main__":
    try:
        assert if_valid_onnx_model(sys.argv[-1])
    except Exception as e:
        raise RuntimeError(f"Error in validating model file: {e}")
        sys.exit("OnnxModelValidationError")

class SingularMatrixError(RuntimeError):
    """Error from numpy for matrix being non-invertible"""

    ERROR_MSG = "Singular matrix found during inversion. You can provide an invertible matrix by modifying your dataset."

    def __init__(self, error: Exception):
        raise RuntimeError(f"{error}: {self.ERROR_MSG}")

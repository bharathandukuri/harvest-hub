package csp.harvest_hub.util;

import csp.harvest_hub.dto.ApiResponse;
import csp.harvest_hub.enums.MessageType;
import csp.harvest_hub.enums.ResponseCode;
import org.springframework.http.ResponseEntity;

/**
 * Utility class for building consistent API responses.
 */
public class ResponseFactory {

    public static ResponseEntity<ApiResponse> success(ResponseCode code, String message, Object data) {
        return ResponseEntity.ok(new ApiResponse(MessageType.SUCCESS, code, message, data));
    }

    public static ResponseEntity<ApiResponse> success(ResponseCode code, String message) {
        return success(code, message, null);
    }

    public static ResponseEntity<ApiResponse> error(ResponseCode code, String message) {
        return ResponseEntity.ok(new ApiResponse(MessageType.ERROR, code, message, null));
    }

    public static ResponseEntity<ApiResponse> info(ResponseCode code, String message, Object data) {
        return ResponseEntity.ok(new ApiResponse(MessageType.INFO, code, message, data));
    }

    public static ResponseEntity<ApiResponse> warning(ResponseCode code, String message, Object data) {
        return ResponseEntity.ok(new ApiResponse(MessageType.WARNING, code, message, data));
    }
}

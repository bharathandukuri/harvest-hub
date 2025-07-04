package csp.harvest_hub.dto;

import csp.harvest_hub.enums.MessageType;
import csp.harvest_hub.enums.ResponseCode;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {
    private MessageType type;
    private ResponseCode code;
    private String message;
    private Object data;

    public static ApiResponse success(ResponseCode code, String message, Object data) {
        return new ApiResponse(MessageType.SUCCESS, code, message, data);
    }

    public static ApiResponse error(ResponseCode code, String message) {
        return new ApiResponse(MessageType.ERROR, code, message, null);
    }

    public static ApiResponse warning(ResponseCode code, String message) {
        return new ApiResponse(MessageType.WARNING, code, message, null);
    }

    public static ApiResponse info(ResponseCode code, String message) {
        return new ApiResponse(MessageType.INFO, code, message, null);
    }
}

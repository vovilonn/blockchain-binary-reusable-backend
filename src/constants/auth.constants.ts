export enum CommonAuthStrategies {
    byWeb3Signature = "web3-signature",
    endpointSignature = "endpoint-signature",
}

export enum CommonCachePrefixes {
    authMessageToSign = "authMessageToSign: ",
    endpointMessageToSign = "endpointMessageToSign: ",
}

export enum MethodType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD",
}

export enum CommonSignMessagePrefixes {
    authMessageToSign = "Magnet user auth. Nonce: ",
    endpointMessageToSign = "Magnet check user. Nonce: ",
}

export const SignMessageEndpointsConfig = [
    {
        path: "/user/grant-role",
        method: MethodType.POST,
        ttl: 180,
    },
];

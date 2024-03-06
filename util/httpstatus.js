class httpstatus {
  successRespone(data) {
    return JSON.stringify({
      code: "200",
      status: "success",
      data: data,
    });
  }
  errorRespone(data) {
    return JSON.stringify({
      code: "500",
      status: "error",
      data: data,
    });
  }
  duplicationResponse(data) {
    return JSON.stringify({
      code: "409",
      status: "duplication",
      data: data,
    });
  }
  invalidResponse(data) {
    return JSON.stringify({
      code: "401",
      status: "unauthorized",
      data: data,
    });
  }
  invalidInputResponse(data) {
    return JSON.stringify({
      code: "422",
      status: "error",
      data: data,
    });
  }
  badRequestResponse(data) {
    return JSON.stringify({
        code: "400",
        status: "bad_request",
        data: data,
    });
}
  notFoundResponse(data) {
    return JSON.stringify({
      code: "404",
      status: "not_found",
      data: data,
    });
  }

}
module.exports = new httpstatus();

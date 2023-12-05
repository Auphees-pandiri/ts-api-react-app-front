import axios from "axios";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
// const baseUrl = window.location.host.includes("localhost") ? '/tigersheet/public' : "";
// const baseUrl = window.location.host.includes("localhost") ? "" : "";
const baseUrl = "";

class ApiClient {
  static async sendRequest(
    url,
    method,
    params = {},
    body = {},
    shouldFormatBody = true,
    isFileFormat = false
  ) {
    params = params || null;
    method = method || "GET";

    const formData = new FormData();
    if (shouldFormatBody) {
      Object.keys(body).forEach((key) => {
        let value = body[key];
        if (!isFileFormat && typeof value === "object") {
          value = JSON.stringify(value);
        }

        formData.append(key, value);
      });
    }

    try {
      const response = await axios({
        method: "POST",
        url: baseUrl + url,
        params: params,
        data: shouldFormatBody ? formData : body,
        withCredentials: true,
        headers: {
            "Authorization": "805201550f1abae7c62d8d1f30b445816c2255983bd147b60ec4d799e26ee6bb",
          "Access-Control-Allow-Origin": "http://localhost:3000"
        },
      });

      console.log(response.data);
      
      return response.data;
    } catch (e) {
      if (e.response.data) {
        throw {
          message: e.response?.data?.messages || "Api Failed",
          response: e.response.data,
        }
      } else {
        throw e;
      }
    }
  }
}

export default ApiClient;

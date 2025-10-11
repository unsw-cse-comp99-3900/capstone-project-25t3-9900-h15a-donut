const BASE_URL = "http://127.0.0.1:8000";

interface ApiResponse<T = any> {
  data?: T;
  detail?: string;
  access_token?: string;
  token_type?: string;
}

const defaultOptions: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

// get token
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("access_token");
  const tokenType = localStorage.getItem("token_type") || "bearer";

  if (token) {
    return {
      Authorization: `${tokenType} ${token}`,
    };
  }
  return {};
};

// GET
const get = async <T = any>(url: string): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...defaultOptions,
      method: "GET",
      headers: {
        ...defaultOptions.headers,
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (data.detail && response.status >= 400) {
      throw new Error(data.detail);
    }

    return data as T;
  } catch (error: any) {
    console.error("GET request failed:", error);
    throw new Error(error.message || "Request failed");
  }
};

// POST
const post = async <T = any>(url: string, body?: any): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...defaultOptions,
      method: "POST",
      headers: {
        ...defaultOptions.headers,
        ...getAuthHeaders(),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<T> = await response.json();
    return data as T;
  } catch (error: any) {
    console.error("POST request failed:", error);
    throw new Error(error.message || "Request failed");
  }
};

// POST(FormData)
const postFormData = async <T = any>(
  url: string,
  formData: FormData
): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<T> = await response.json();
    return data as T;
  } catch (error: any) {
    console.error("POST FormData request failed:", error);
    throw new Error(error.message || "Request failed");
  }
};

// PUT
const put = async <T = any>(url: string, body: any): Promise<T> => {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...defaultOptions,
      method: "PUT",
      headers: {
        ...defaultOptions.headers,
        ...getAuthHeaders(),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `HTTP error! status: ${response.status}`
      );
    }

    const data: ApiResponse<T> = await response.json();
    return data as T;
  } catch (error: any) {
    console.error("PUT request failed:", error);
    throw new Error(error.message || "Request failed");
  }
};

// API 接口定义
const api = {
  // 认证相关
  auth: {
    login: (email: string, password: string) => {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);
      return postFormData("/auth/login-form", formData); // 使用 login-form 端点
    },
    register: (email: string, password: string, companyName: string) =>
      post("/auth/register", {
        email,
        password,
        company_name: companyName, // 注意字段名要匹配后端模型
      }),
  },

  projects: {
    list: () => get("/projects/"),
    create: (project: any) => post("/projects/", project),
  },

  roles: {
    list: () => get("/roles/"),
    create: (role: any) => post("/roles/", role),
  },

  get,
  post,
  put,
  postFormData,
};

export default api;

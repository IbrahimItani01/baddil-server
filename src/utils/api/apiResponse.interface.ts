export interface ApiResponse<T = any> {
  success: boolean; // Indicates if the operation was successful
  message: string; // A descriptive message about the response
  data?: T; // The data returned from the API (optional)
  error?: any; // Error details, if any (optional)
}

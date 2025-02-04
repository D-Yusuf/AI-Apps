export default function customErrorHandler (error, request, response, next)  {
    try {
      return response
        .status(error.status || 500)
        .json({ error: error || "Server Went down" });
    } catch (error) {
      next(error);
    }
  };
  

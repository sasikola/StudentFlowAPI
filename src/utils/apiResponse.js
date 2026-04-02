const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors }),
  });
};

const sendPaginated = (res, data, totalCount, currentPage, limit, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      totalCount,
      currentPage,
      totalPages:  Math.ceil(totalCount / limit),
      limit,
      hasNextPage: currentPage < Math.ceil(totalCount / limit),
      hasPrevPage: currentPage > 1,
    },
  });
};

module.exports = { sendSuccess, sendError, sendPaginated };
export const useConfiguration = () => {
  return {
    PAGE_SIZE: 500,
    MAX_PAGE_ITEMS: 999999,
    // Max upload file size is 5MB in bytes
    MAX_UPLOAD_FILE_SIZE: 5 * 1024 * 1024,
    EXCEL_MIME_TYPES: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  };
};
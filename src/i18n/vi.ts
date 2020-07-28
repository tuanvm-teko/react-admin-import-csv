export default {
  csv: {
    main: {
      import: "Nhập dữ liệu",
    },
    error: {
      noId: "Cập nhập yêu cầu phải có trường 'id'",
      hasId: "Tạo mới nên không có trường 'id'",
      importing: "Đang nhập dữ liệu ...",
      emptyResource:
        "Tài nguyên đang rỗng, bạn chưa pass {...props} vao ImportButton",
    },
    alert: {
      imported: "Đã nhập dữ liệu xong!",
    },
    dialog: {
      importTo: "Nhập dữ liệu vào",
      dataFileReq: "Data file requirements",
      extension: "Must be a '.csv' or '.tsv' file",
      idColumnCreate: "Khi nhập mới thì không có trường 'id'",
      idColumnUpdate: "Khi cập nhật thì phải có trường 'id'",
      chooseFile: "Chọn tệp",
      processed: "Đã xử lý xong",
      rowCount: "Số lượng dòng nhập",
      cancel: "Hủy",
      importNew: "Nhập mới",
      importOverride: "Cập nhật",
    },
  },
};

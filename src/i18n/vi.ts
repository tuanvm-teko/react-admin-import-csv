export default {
  csv: {
    main: {
      import: "Nhập dữ liệu",
    },
    error: {
      noId: "Cập nhập yêu cầu phải có trường 'id'",
      hasId: "Tạo mới nên không có trường 'id'",
      importing: "Nhập lỗi: ",
      emptyResource:
        "Tài nguyên đang rỗng, bạn chưa pass {...props} vao ImportButton",
    },
    alert: {
      imported: "Đã nhập dữ liệu xong!",
    },
    dialog: {
      importTo: "Nhập dữ liệu vào",
      dataFileReq: "Dữ liệu trong tệp:",
      extension: "Phải ở định dạng '.csv', '.tsv', '.xlsx', '.xls'",
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

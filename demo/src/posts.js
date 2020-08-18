// in src/posts.js
import * as React from "react";
// tslint:disable-next-line:no-var-requires
import {
  Datagrid,
  List,
  Show,
  Create,
  Edit,
  SimpleShowLayout,
  SimpleForm,
  TextField,
  TextInput,
  TopToolbar,
  ShowButton,
  EditButton,
  DeleteButton,
} from "react-admin";
// Change this import to: from "react-admin-import-csv"
import { ImportButton } from "./build-watch";
import { CreateButton } from "ra-ui-materialui";
import slugi from "slugify";
const ListActions = (props) => {
  const { className, basePath } = props;
  return (
    <TopToolbar className={className}>
      <CreateButton basePath={basePath} />
      <ImportButton
        {...props}
        logging="true"
        parseConfig={{
          transformHeader: (head) => {
            const HEADER_MAPPER = {
              vat_tu: "name",
              ma_vat_tu: "materialCode",
              ma_hieu: "code",
              don_vi: "unit",
              so_luong: "count",
              hang_san_xuat_xuat_xu: "madein",
              thong_so_ky_thuat: "info",
              he_thong: "system",
              ghi_chu: "note",
            };
            const stringToSlug = (str) => {
              // remove accents
              var from =
                  "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
                to =
                  "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
              for (var i = 0, l = from.length; i < l; i++) {
                str = str.replace(RegExp(from[i], "gi"), to[i]);
              }

              return str;
            };
            const slugify = (str) =>
              slugi(stringToSlug(str), { lower: true, replacement: "_" });
            const snake = slugify(head);
            return HEADER_MAPPER[snake] || snake;
          },
        }}
      />
    </TopToolbar>
  );
};
export const PostList = (props) => (
  <List {...props} actions={<ListActions />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ShowButton label="" />
      <EditButton label="" />
      <DeleteButton label="" redirect={false} />
    </Datagrid>
  </List>
);

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
    </SimpleShowLayout>
  </Show>
);

export const PostCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Create>
);

export const PostEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="title" />
    </SimpleForm>
  </Edit>
);

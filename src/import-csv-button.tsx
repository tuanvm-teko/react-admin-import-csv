import React from "react";
import {
  Button as RAButton,
  resolveBrowserLocale,
  useRefresh,
} from "react-admin";
import GetAppIcon from "@material-ui/icons/GetApp";
import { useNotify, useDataProvider } from "react-admin";
import { processCsvFile } from "./csv-extractor";

import englishMessages from "ra-language-english";
import spanishMessages from "ra-language-spanish";
import vietnameseMessages from "ra-language-vietnamese";

import * as domainMessages from "./i18n";
import polyglotI18nProvider from "ra-i18n-polyglot";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@material-ui/core";

export const ImportButton = (props: any) => {
  const messages = {
    es: { ...spanishMessages, ...domainMessages.es },
    en: { ...englishMessages, ...domainMessages.en },
    vi: { ...vietnameseMessages, ...domainMessages.vi },
  };

  const i18nProvider = polyglotI18nProvider(
    (locale) => (messages[locale] ? messages[locale] : messages.en),
    resolveBrowserLocale()
  );

  const { resource, parseConfig, logging, preCommitCallback } = props;

  if (logging) {
    console.log({ props });
  }
  if (!resource) {
    throw new Error(i18nProvider.translate("csv.error.emptyResource"));
  }

  let { variant, label, resourceName } = props;
  if (!label) {
    label = i18nProvider.translate("csv.main.import");
  }

  if (!variant) {
    variant = "text";
  }

  if (!resourceName) {
    resourceName = resource;
  }

  const [open, setOpen] = React.useState(false);
  const [importing, setImporting] = React.useState(false);
  const [fileName, setFileName] = React.useState(null as string);
  const [values, setValues] = React.useState(null as any[]);
  const [errorTxt, setErrorTxt] = React.useState(null as string);
  const refresh = useRefresh();

  const openImportDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImporting(false);
    setFileName(null as string);
    setValues(null as any[]);
  };

  const handleComplete = (error = false) => {
    handleClose();
    if (!error) {
      notify(
        `${i18nProvider.translate("csv.alert.imported")} ${fileName}`,
        "info",
        {}
      );
      refresh();
    }
    if (error) {
      notify(
        `${i18nProvider.translate(
          "csv.error.importing"
        )} ${fileName}, ${error}`,
        "error",
        {}
      );
    }
  };

  const handleSubmitCreate = async () => {
    setImporting(true);
    try {
      if (values.some((v) => v.id)) {
        throw new Error(i18nProvider.translate("csv.error.hasId"));
      }
      if (preCommitCallback) setValues(preCommitCallback("create", values));
      await dataProvider.create(resource, { data: values });
      handleComplete();
    } catch (error) {
      handleComplete(error);
    }
  };

  const handleSubmitOverwrite = async () => {
    setImporting(true);
    try {
      if (values.some((v) => !v.id)) {
        throw new Error(i18nProvider.translate("csv.error.noId"));
      }
      if (preCommitCallback) setValues(preCommitCallback("overwrite", values));
      Promise.all(
        values.map((value) =>
          dataProvider.update(resource, { id: value.id, data: value })
        )
      ).then(() => {
        handleComplete();
      });
    } catch (error) {
      handleComplete(error);
    }
  };

  const notify = useNotify();
  const dataProvider = useDataProvider();

  const onFileAdded = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFileName(file.name);
    try {
      const values = await processCsvFile(file, parseConfig);
      if (logging) {
        console.log({ values });
      }
      setValues(values);
      setErrorTxt(null);
    } catch (error) {
      console.error(error);
      setValues(null);
      setErrorTxt(error.toString());
    }
  };

  return (
    <>
      <RAButton
        color="primary"
        component="span"
        variant={variant}
        label={label}
        onClick={openImportDialog}>
        <GetAppIcon style={{ transform: "rotate(180deg)", fontSize: "20" }} />
      </RAButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {i18nProvider.translate("csv.dialog.importTo")} "
          {i18nProvider.translate(`resources.${resourceName}.importName`)}"
        </DialogTitle>
        <DialogContent>
          <div
            id="alert-dialog-description"
            style={{ fontFamily: "sans-serif" }}>
            <p style={{ margin: "0px" }}>
              {i18nProvider.translate("csv.dialog.dataFileReq")}
            </p>
            <ol>
              <li>{i18nProvider.translate("csv.dialog.extension")}</li>
              <li>{i18nProvider.translate("csv.dialog.idColumnCreate")}</li>
              <li>{i18nProvider.translate("csv.dialog.idColumnUpdate")}</li>
            </ol>
            <Button variant="contained" component="label">
              <span>{i18nProvider.translate("csv.dialog.chooseFile")}</span>
              <GetAppIcon
                style={{ transform: "rotate(180deg)", fontSize: "20" }}
              />
              <input
                type="file"
                style={{ display: "none" }}
                onChange={onFileAdded}
                accept=".csv,.tsv,.txt,.xlsx,.xls"
              />
            </Button>
            {!!fileName && (
              <p style={{ marginBottom: "0px" }}>
                {i18nProvider.translate("csv.dialog.processed")}:{" "}
                <strong>{fileName}</strong>
              </p>
            )}
            {!!values && (
              <p style={{ margin: "0px" }}>
                {i18nProvider.translate("csv.dialog.rowCount")}:{" "}
                <strong>{values.length}</strong>
              </p>
            )}
            {!!errorTxt && (
              <p style={{ margin: "0px", color: "red" }}>{errorTxt}</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span>{i18nProvider.translate("csv.dialog.cancel")}</span>
          </Button>
          <Button
            disabled={!values || importing}
            onClick={handleSubmitCreate}
            color="secondary"
            variant="contained">
            {importing && <CircularProgress size={18} thickness={2} />}
            <span>{i18nProvider.translate("csv.dialog.importNew")}</span>
          </Button>
          <Button
            disabled={!values || importing}
            onClick={handleSubmitOverwrite}
            color="primary"
            variant="contained">
            {importing && <CircularProgress size={18} thickness={2} />}
            <span>{i18nProvider.translate("csv.dialog.importOverride")}</span>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

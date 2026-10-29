import { createAsyncThunk } from "@reduxjs/toolkit";

import { changeColumnName } from "../../api/columnsApi";
import type { Column } from "../../types/board";

export type ChangeColumnName = {
  id: Column["id"];
  newColumnId: Column["id"];
  title: Column["title"];
};

export const changeColumnNameThunk = createAsyncThunk(
  "columns/changeColumnName",
  async ({ id, newColumnId, title }: ChangeColumnName) => {
    const updatedColumn = await changeColumnName({
      id,
      newColumnId,
      title,
    });

    return {
      oldId: id,
      column: updatedColumn,
    };
  },
);

import { useState, useRef, forwardRef, useImperativeHandle } from "react";
import { styled } from "@mui/material/styles";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import Para from "./para";

import "./styles.css";

const MUITextField = styled(TextField)({
  display: "inline-flex",
  verticalAlign: "middle",
  marginTop: "2px",
  marginBottom: "2px",
  "& .MuiInputBase-input": {
    padding: "2px 8px"
  }
});

const MUIFormControl = styled(FormControl)({
  display: "inline-flex",
  verticalAlign: "middle",
  marginTop: "2px",
  marginBottom: "2px",
  minWidth: 120,
  "& .MuiSelect-select": {
    padding: "2px 32px 2px 8px"
  }
});

const MUITypography = styled(Typography)({
  overflow: "auto",
  marginTop: "15px",
  flex: 1,
  minHeight: 0
});

const Parse = forwardRef(function Parse(props, ref) {
  const inputValues = useRef([]);
  const inputCount = useRef(-1);
  const selectValues = useRef([]);
  const selectCount = useRef(-1);
  const paragraphValues = useRef([]);
  const paragraphCount = useRef(-1);
  const paragraphData = useRef([]);

  const CTextField = function() {
    inputCount.current++;
    inputValues.current.push("");
    const closureCount = inputCount.current;
    return (
      <MUITextField
        key={`input-${closureCount}`}
        size="small"
        onChange={e => {
          inputValues.current[closureCount] = e.target.value;
        }}
      />
    );
  };

  const CSelect = function(match) {
    selectCount.current++;
    selectValues.current.push("");
    const closureCount = selectCount.current;

    match = match.substring(1, match.length - 1);
    const matches = match.split("/");
    const menus = matches.map(single => (
      <MenuItem key={single} value={single}>{single}</MenuItem>
    ));

    return (
      <MUIFormControl key={`select-${closureCount}`}>
        <Select
          size="small"
          defaultValue=""
          onChange={e => {
            selectValues.current[closureCount] = e.target.value;
          }}
        >
          {menus}
        </Select>
      </MUIFormControl>
    );
  };

  const CParagraph = function() {
    paragraphCount.current++;
    paragraphValues.current.push("");
    const closureCount = paragraphCount.current;
    return (
      <Para
        key={`paragraph-${closureCount}`}
        paragraphs={paragraphData.current}
        store={paragraphValues.current[closureCount]}
        paragraphValues={paragraphValues.current}
        closureCount={closureCount}
      />
    );
  };

  const createSelectors = function(element) {
    if (typeof element === "object") {
      return element;
    }

    const listRegx = /{[\w\s-.,;:`"'()]*\/.*?}/g;
    let select = element.split(listRegx);

    let match;
    let indx = 1;

    while ((match = listRegx.exec(element)) !== null) {
      select.splice(indx, 0, CSelect(match[0]));
      indx += 2;
    }

    select = select.filter(item => item);
    return select;
  };

  const filterParagraphs = function(element) {
    if (typeof element[0] !== "string") {
      return element;
    }
    paragraphData.current = [];
    // JS bug with trailing last character caused by regex new line
    ///{.+\|(.|[\r\n])+?}/g;
    const listRegx = /{.+\|.+?}/g;
    let paragraphParts = element.split(listRegx);
    let match;

    while ((match = listRegx.exec(element)) !== null) {
      paragraphData.current.push(match);
    }

    paragraphParts = paragraphParts.filter(item => item);
    return paragraphParts;
  };

  const createParagraphs = function(element) {
    if (typeof element[0] !== "string") {
      return element;
    }

    const listRegx = /{\*}/g;
    let paragraph = element.split(listRegx);

    let indx = 1;

    while (listRegx.exec(element) !== null) {
      paragraph.splice(indx, 0, CParagraph());
      indx += 2;
    }

    paragraph = paragraph.filter(item => item);
    return paragraph;
  };

  function getAll(sourceStr) {
    if (sourceStr.length < 1) {
      return [];
    }

    inputCount.current = -1;
    selectCount.current = -1;
    // paragraphCount is intentionally NOT reset — the paragraph ordering
    // hack in showRaw relies on the array growing across renders.

    const input = sourceStr.split("{_}");
    const inputDone = [...input]
      .map((e, i) => (i < input.length - 1 ? [e, CTextField()] : [e]))
      .reduce((a, b) => a.concat(b));

    let selectDone = inputDone.map(createSelectors).flat();
    let paraFilter = selectDone.map(filterParagraphs).flat();
    let paraDone = paraFilter.map(createParagraphs).flat();

    return paraDone;
  }

  const data = getAll(props.data);

  const copy = () => {
    let inRaw = 0;
    let slRaw = 0;
    let paRaw = 0;
    let rawList = [];

    while (inputValues.current[inputValues.current.length - 1] === "") {
      inputValues.current.pop();
    }
    while (selectValues.current[selectValues.current.length - 1] === "") {
      selectValues.current.pop();
    }

    // --- This fixes a bug in a neat hack ---
    // paragraphs out of order once changes made to {data}
    let rawCount = 0;
    data.forEach(dataPoint => {
      if (dataPoint.props !== undefined) {
        if (dataPoint.props.store !== undefined) {
          rawCount++;
        }
      }
    });

    let tParaArr = paragraphValues.current.slice(
      paragraphValues.current.length - rawCount,
      paragraphValues.current.length
    );
    let divider = paragraphValues.current.length / rawCount;
    for (let i = divider - 1; i >= 0; i--) {
      for (let j = 0; j < rawCount; j++) {
        if (tParaArr[j] === "" || tParaArr[j] === undefined) {
          if (
            paragraphValues.current[i + j] !== "" &&
            paragraphValues.current[i + j] !== undefined
          ) {
            tParaArr[j] = paragraphValues.current[i + j];
          }
        }
      }
    }
    // ---

    data.forEach(dataPoint => {
      if (typeof dataPoint === "string") {
        rawList.push(dataPoint);
      } else if (dataPoint.props.size === "small") {
        rawList.push(inputValues.current[inRaw]);
        inRaw++;
      } else if (dataPoint.props.store !== undefined) {
        rawList.push(tParaArr[paRaw]);
        paRaw++;
      } else {
        rawList.push(selectValues.current[slRaw]);
        slRaw++;
      }
    });

    while (rawList[rawList.length - 1] === "") {
      rawList.pop();
    }

    navigator.clipboard.writeText(rawList.join("").trim());
  };

  useImperativeHandle(ref, () => ({ copy }));

  return (
    <MUITypography component="div" align="left" style={{ whiteSpace: "pre-line" }}>
      {data}
    </MUITypography>
  );
});

export default Parse;

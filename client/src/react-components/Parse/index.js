import { useState, useRef } from "react";
import { styled } from "@mui/material/styles";

import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import DoneIcon from "@mui/icons-material/Done";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import FormControl from "@mui/material/FormControl";

import Para from "./para";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../theme";

import "./styles.css";

const MUITextField = styled(TextField)({
  marginTop: "-1px",
  marginBottom: "1px"
});

const MUIFormControl = styled(FormControl)({
  marginTop: "-3px",
  marginBottom: "3px"
});

const MUIButton = styled(Button)({
  position: "absolute",
  bottom: "var(--spacing-edge)",
  right: "var(--spacing-edge)"
});

const MUITypography = styled(Typography)({
  overflow: "auto",
  marginTop: "15px",
  height: "calc(100% - 18px)",
  scrollbarWidth: "none"
});

export default function Parse(props) {
  // Per-instance mutable storage for interactive element values.
  // useRef so values survive re-renders without triggering them.
  const inputArr = useRef([]);
  const inputCount = useRef(-1);
  const selectArr = useRef([]);
  const selectCount = useRef(-1);
  const paraArr = useRef([]);
  const paraCount = useRef(-1);
  const paragraphData = useRef([]);

  // ── Factory functions ────────────────────────────────────────────────────
  // Defined inside the component so they close over the per-instance refs
  // instead of shared module-level variables.

  const CTextField = function() {
    inputCount.current++;
    inputArr.current.push("");
    const closureCount = inputCount.current;
    return (
      <MUITextField
        size="small"
        onChange={e => {
          inputArr.current[closureCount] = e.target.value;
        }}
      />
    );
  };

  const CSelect = function(match) {
    selectCount.current++;
    selectArr.current.push("");
    const closureCount = selectCount.current;

    match = match.substring(1, match.length - 1);
    const matches = match.split("/");
    const menus = matches.map(single => (
      <MenuItem key={single} value={single}>{single}</MenuItem>
    ));

    return (
      <MUIFormControl>
        <Select
          onChange={e => {
            selectArr.current[closureCount] = e.target.value;
          }}
        >
          {menus}
        </Select>
      </MUIFormControl>
    );
  };

  const CParagraph = function() {
    paraCount.current++;
    paraArr.current.push("");
    const closureCount = paraCount.current;
    return (
      <Para
        paragraphs={paragraphData.current}
        store={paraArr.current[closureCount]}
        paraArr={paraArr.current}
        closureCount={closureCount}
      />
    );
  };

  // ── Parsing pipeline ────────────────────────────────────────────────────

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
    let paraData = element.split(listRegx);
    let match;

    while ((match = listRegx.exec(element)) !== null) {
      paragraphData.current.push(match);
    }

    paraData = paraData.filter(item => item);
    return paraData;
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
    // paraCount is intentionally NOT reset — the paragraph ordering
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

  // ── Render ───────────────────────────────────────────────────────────────

  const data = getAll(props.data);
  const [cIcon, setCIcon] = useState(<FileCopyIcon />);

  const showRaw = () => {
    let inRaw = 0;
    let slRaw = 0;
    let paRaw = 0;
    let rawList = [];

    // Logic creates empty values trailing, remove them
    while (inputArr.current[inputArr.current.length - 1] === "") {
      inputArr.current.pop();
    }
    while (selectArr.current[selectArr.current.length - 1] === "") {
      selectArr.current.pop();
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

    let tParaArr = paraArr.current.slice(
      paraArr.current.length - rawCount,
      paraArr.current.length
    );
    let divider = paraArr.current.length / rawCount;
    for (let i = divider - 1; i >= 0; i--) {
      for (let j = 0; j < rawCount; j++) {
        if (tParaArr[j] === "" || tParaArr[j] === undefined) {
          if (
            paraArr.current[i + j] !== "" &&
            paraArr.current[i + j] !== undefined
          ) {
            tParaArr[j] = paraArr.current[i + j];
          }
        }
      }
    }
    // ---

    data.forEach(dataPoint => {
      if (typeof dataPoint === "string") {
        rawList.push(dataPoint);
      } else if (dataPoint.props.size === "small") {
        rawList.push(inputArr.current[inRaw]);
        inRaw++;
      } else if (dataPoint.props.store !== undefined) {
        rawList.push(tParaArr[paRaw]);
        paRaw++;
      } else {
        rawList.push(selectArr.current[slRaw]);
        slRaw++;
      }
    });

    while (rawList[rawList.length - 1] === "") {
      rawList.pop();
    }

    navigator.clipboard.writeText(rawList.join("").trim());
    setCIcon(<DoneIcon />);
    setTimeout(function() {
      setCIcon(<FileCopyIcon />);
    }, 1250);
  };

  return (
    <ThemeProvider theme={theme}>
      <MUITypography align="left" style={{ whiteSpace: "pre-line" }}>
        {data}
      </MUITypography>
      <MUIButton
        color="primary"
        onClick={showRaw}
        variant="contained"
        startIcon={cIcon}
      >
        Copy to clipboard
      </MUIButton>
    </ThemeProvider>
  );
}

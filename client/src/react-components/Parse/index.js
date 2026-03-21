import { useState, useRef, useEffect, useMemo, forwardRef, useImperativeHandle } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";

import {
  MUITextField,
  MUIFormControl,
  NumberForge,
  parseForgeContent,
  formatIsoDate,
  initLocalValues,
  makePartsGetter,
  renderForgeParts
} from "./forgeComponents";
import Para from "./para";
import { printText } from "../Shared/printUtils";

import "./styles.css";

const MUITypography = styled(Typography)({
  marginTop: "15px",
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
});

function OptionalForge({ parts, closureCount, optionalGetters }) {
  const [checked, setChecked] = useState(false);
  const checkedRef = useRef(false);
  const localValues = useRef(initLocalValues(parts));

  useEffect(() => {
    const getter = makePartsGetter(parts, localValues);
    optionalGetters[closureCount] = () => checkedRef.current ? getter() : "";
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    const next = !checkedRef.current;
    checkedRef.current = next;
    setChecked(next);
  };

  return (
    <Box
      component="span"
      data-forgetype="optional"
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={toggle}
      onKeyDown={e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(); } }}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        cursor: "pointer",
        userSelect: "none",
        gap: 0.25,
        mx: 0.25
      }}
    >
      <Checkbox size="small" checked={checked} onChange={() => {}} tabIndex={-1} sx={{ p: 0 }} />
      <Box
        component="span"
        sx={{
          display: "inline-flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.25,
          color: checked ? "text.primary" : "text.disabled",
          textDecoration: checked ? "none" : "line-through",
          fontSize: "inherit",
          lineHeight: "inherit"
        }}
      >
        {renderForgeParts(parts, localValues, true)}
      </Box>
    </Box>
  );
}

const Parse = forwardRef(function Parse(props, ref) {
  const inputValues = useRef([]);
  const inputCount = useRef(-1);
  const selectValues = useRef([]);
  const selectCount = useRef(-1);
  const paragraphValues = useRef([]);
  const paragraphCount = useRef(-1);
  const paragraphData = useRef([]);
  const dateValues = useRef([]);
  const dateCount = useRef(-1);
  const numberValues = useRef([]);
  const numberCount = useRef(-1);
  const optionalGetters = useRef([]);
  const optionalCount = useRef(-1);

  const PageTextField = function() {
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

  const PageSelect = function(match) {
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

  const PageDate = function() {
    dateCount.current++;
    const today = new Date().toISOString().split("T")[0];
    dateValues.current.push(today);
    const closureCount = dateCount.current;
    return (
      <MUITextField
        key={`date-${closureCount}`}
        data-forgetype="date"
        type="date"
        size="small"
        defaultValue={today}
        onChange={e => { dateValues.current[closureCount] = e.target.value; }}
        sx={{ width: 155, colorScheme: "dark" }}
      />
    );
  };

  const PageNumber = function() {
    numberCount.current++;
    numberValues.current.push("0");
    const closureCount = numberCount.current;
    return (
      <NumberForge
        key={`number-${closureCount}`}
        data-forgetype="number"
        onChange={v => { numberValues.current[closureCount] = v; }}
      />
    );
  };

  const PageOptional = function(parts) {
    optionalCount.current++;
    const closureCount = optionalCount.current;
    return (
      <OptionalForge
        key={`optional-${closureCount}`}
        data-forgetype="optional"
        parts={parts}
        closureCount={closureCount}
        optionalGetters={optionalGetters.current}
      />
    );
  };

  const PageParagraph = function() {
    paragraphCount.current++;
    const closureCount = paragraphCount.current;
    return (
      <Para
        key={`paragraph-${closureCount}`}
        paragraphs={paragraphData.current}
        paragraphValues={paragraphValues.current}
        closureCount={closureCount}
      />
    );
  };

  const createSelectors = function(element) {
    if (typeof element !== "string") return element;

    const listRegx = /{[\w\s-.,;:`"'()]*\/.*?}/g;
    let select = element.split(listRegx);

    let match;
    let indx = 1;

    while ((match = listRegx.exec(element)) !== null) {
      select.splice(indx, 0, PageSelect(match[0]));
      indx += 2;
    }

    select = select.filter(item => item);
    return select;
  };

  const createDates = function(element) {
    if (typeof element !== "string") return element;
    const parts = element.split("{date}");
    return parts.map((part, i) => (i < parts.length - 1 ? [part, PageDate()] : [part])).flat();
  };

  const createNumbers = function(element) {
    if (typeof element !== "string") return element;
    const parts = element.split("{#}");
    return parts.map((part, i) => (i < parts.length - 1 ? [part, PageNumber()] : [part])).flat();
  };

  // Optionals are processed on the raw source string before any other forge type
  // can fragment their content. The regex allows nested single-level {forge} tokens.
  const createOptionals = function(str) {
    if (typeof str !== "string") return str;
    const splitRegx = /\{\?:(?:[^{}]|\{[^}]*\})+\}/g;
    const matchRegx = /\{\?:((?:[^{}]|\{[^}]*\})+)\}/g;
    let parts = str.split(splitRegx);
    let match;
    let indx = 1;
    while ((match = matchRegx.exec(str)) !== null) {
      parts.splice(indx, 0, PageOptional(parseForgeContent(match[1])));
      indx += 2;
    }
    return parts.filter(item => item !== "");
  };

  const createParagraphs = function(element) {
    if (typeof element !== "string") {
      return element;
    }

    const listRegx = /{\*}/g;
    let paragraph = element.split(listRegx);

    let indx = 1;

    while (listRegx.exec(element) !== null) {
      paragraph.splice(indx, 0, PageParagraph());
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
    paragraphCount.current = -1;
    dateCount.current = -1;
    numberCount.current = -1;
    optionalCount.current = -1;

    // Extract paragraph DATA blocks {Title|text} from the raw source string first,
    // before any other step can fragment their content. Supports up to two levels
    // of nested forge tokens inside the paragraph text (e.g. {?:{#}}).
    paragraphData.current = [];
    const paraDataRegx = /\{[^|{}]+\|(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})*\}/g;
    let paraMatch;
    while ((paraMatch = paraDataRegx.exec(sourceStr)) !== null) {
      paragraphData.current.push(paraMatch);
    }
    const stripped = sourceStr.replace(paraDataRegx, "").replace(/\n{3,}/g, "\n\n").trimEnd();

    let optionalDone = createOptionals(stripped);

    let inputDone = optionalDone.map(e => {
      if (typeof e !== "string") return e;
      const splits = e.split("{_}");
      return splits.map((s, i) => i < splits.length - 1 ? [s, PageTextField()] : [s]).flat();
    }).flat();

    let selectDone = inputDone.map(createSelectors).flat();
    let dateDone = selectDone.map(createDates).flat();
    let numberDone = dateDone.map(createNumbers).flat();
    let paraDone = numberDone.map(createParagraphs).flat();

    return paraDone;
  }

  // Memoize parse output: getAll is expensive (regex + element creation) and
  // only needs to re-run when the template string actually changes.
  // Internal factory functions (PageTextField, PageSelect…) only write to stable refs,
  // so returning a cached element array is safe when props.data is unchanged.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const data = useMemo(() => getAll(props.data), [props.data]);

  const buildRawList = () => {
    while (inputValues.current[inputValues.current.length - 1] === "") {
      inputValues.current.pop();
    }
    while (selectValues.current[selectValues.current.length - 1] === "") {
      selectValues.current.pop();
    }

    let inRaw = 0;
    let slRaw = 0;
    let paRaw = 0;
    let dtRaw = 0;
    let nmRaw = 0;
    let opRaw = 0;
    const rawList = [];

    data.forEach(dataPoint => {
      if (typeof dataPoint === "string") {
        rawList.push(dataPoint);
        return;
      }
      const ft = dataPoint.props["data-forgetype"];
      if (ft === "date") {
        const iso = dateValues.current[dtRaw++] || "";
        rawList.push(iso ? formatIsoDate(iso) : "");
      } else if (ft === "number") {
        rawList.push(numberValues.current[nmRaw++] ?? "");
      } else if (ft === "optional") {
        rawList.push(optionalGetters.current[opRaw++]?.() ?? "");
      } else if (dataPoint.props.size === "small") {
        rawList.push(inputValues.current[inRaw++]);
      } else if (dataPoint.type === Para) {
        const val = paragraphValues.current[paRaw++];
        rawList.push(typeof val === "function" ? val() : (val || ""));
      } else {
        rawList.push(selectValues.current[slRaw++]);
      }
    });

    while (rawList[rawList.length - 1] === "" || rawList[rawList.length - 1] == null) {
      rawList.pop();
    }

    return rawList;
  };

  const copy = () => {
    navigator.clipboard.writeText(buildRawList().join("").trim());
  };

  const print = () => {
    printText(buildRawList().join("").trim());
  };

  useImperativeHandle(ref, () => ({ copy, print }));

  return (
    <MUITypography component="div" align="left" style={{ whiteSpace: "pre-line" }} sx={props.sx}>
      {data}
    </MUITypography>
  );
});

export default Parse;

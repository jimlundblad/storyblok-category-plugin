/* eslint-disable @typescript-eslint/no-explicit-any */
import "./example.css";
import { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import { useFieldPlugin } from "@storyblok/field-plugin/react";
import ModalToggle from "./ModalToggle";

// import AsyncSelect from 'react-select/async';
import Select from "react-select";
import type { AriaOnFocus } from "react-select";
import CSS from "csstype";
// import { FieldPluginOption, FieldPluginSchema, } from '@storyblok/field-plugin';
import { request, gql } from "graphql-request";

const document = gql`
  {
    categoriesWithAncestry {
      name
      id
      ancestry
    }
  }
`;

interface CategoriesWithAncestry {
  readonly name: string;
  readonly id: string;
  readonly ancestry: string;
}

interface GraphqlResponse {
  categoriesWithAncestry: CategoriesWithAncestry[];
}

interface Options {
  value: string;
  label: string;
}

const getSavedData = (key: string) => {
  return localStorage.getItem(key)
    ? JSON.parse(localStorage.getItem(key) as string)
    : [];
};

const setSavedData = (key: string, data: Options[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const dataToOptions = (data: CategoriesWithAncestry[]): Options[] => {
  return data.map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });
};

const dataToAncestry = (data: CategoriesWithAncestry[]): Options[] => {
  return data.map((item) => {
    return {
      value: item.id,
      label: item.ancestry,
    };
  });
};

const colourStyles = {
  control: (styles: any) => ({ ...styles, fontSize: "12px" }),
  placeholder: (styles: any) => ({ ...styles, fontSize: "12px" }),
  group: (styles: any) => ({
    ...styles,
    fontSize: "9px",
    paddingTop: "1px",
    paddingBottom: "1px",
    marginTop: "1px",
    marginBottom: "1px",
  }),
  groupHeading: (styles: any) => ({
    ...styles,
    fontSize: "9px",
    borderTop: "1px solid #ccc",
    marginTop: "1px",
    paddingTop: "3px",
  }),
  option: (styles: any) => {
    return {
      ...styles,
      fontSize: "14px",
    };
  },
};

const appCSS: CSS.Properties = {
  minHeight: "450px",
  height: "100%",
};

const labelCSS: CSS.Properties = {
  fontSize: ".75rem",
  fontWeight: "bold",
  lineHeight: 2,
};

const getCategories = async () => {
  try {
    const { categoriesWithAncestry } = (await request(
      "https://wave.uea.ac.uk/graphql",
      document,
    )) as unknown as GraphqlResponse;
    return categoriesWithAncestry;
  } catch (err) {
    console.error("err", err);
  }
};

const WAVECategories: FunctionComponent = () => {
  const { type, data, actions } = useFieldPlugin({
    validateContent: (content: unknown) => ({
      content: Array.isArray(content) ? content : [],
    }),
  });
  const [ariaFocusMessage, setAriaFocusMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selected, setSelected] = useState(getSavedData("waveCategories"));
  const [waveCategories, setWaveCategoriesState] = useState<
    CategoriesWithAncestry[]
  >([]);
  const [options, setOptions] = useState<Options[]>([]);

  // if (type !== 'loaded') {
  //     return null
  // }

  const closeModal = () => {
    actions?.setModalOpen(false);
  };

  useEffect(() => {
    getCategories().then((categories) => {
      setWaveCategoriesState(categories || []);
      getOptions(categories || []);
    });
  }, []);

  useEffect(() => {
    if (data?.content) {
      setSelected(dataToOptions(data.content));
    }
  }, [data]);

  const setCategories = (choices: Options[]) => {
    setSavedData("waveCategories", choices);

    const content = waveCategories.filter((item) => {
      return choices.find((choice) => choice.value == item.id);
    });

    setSelected(dataToOptions(content));

    actions?.setContent(content);
  };

  const getOptions = (categories: CategoriesWithAncestry[]) => {
    setOptions(dataToAncestry(categories));
  };

  const onFocus: AriaOnFocus<Options> = ({ focused, isDisabled }) => {
    const msg = `You are currently focused on option ${focused.label}${
      isDisabled ? ", disabled" : ""
    }`;
    setAriaFocusMessage(msg);
    return msg;
  };

  const onMenuOpen = () => setIsMenuOpen(true);
  const onMenuClose = () => setIsMenuOpen(false);

  return (
    <div className="App" style={appCSS}>
      {data?.isModalOpen && (
        <button type="button" className="btn btn-close" onClick={closeModal}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M1.75738 0.343176L0.343166 1.75739L4.58581 6.00003L0.343165 10.2427L1.75738 11.6569L6.00002 7.41424L10.2427 11.6569L11.6569 10.2427L7.41423 6.00003L11.6569 1.75739L10.2427 0.343176L6.00002 4.58582L1.75738 0.343176Z"
              fill="#1B243F"
            />
          </svg>
          <span className="sr-only">Close Modal</span>
        </button>
      )}
      <div className="container">
        <label
          style={labelCSS}
          id="select-categories-label"
          htmlFor="select-categories"
        >
          Select categories
        </label>
        {!!ariaFocusMessage && !!isMenuOpen && (
          <blockquote>{ariaFocusMessage}</blockquote>
        )}
        <Select
          aria-labelledby="select-categories-label"
          ariaLiveMessages={{
            onFocus,
          }}
          inputId="select-categories"
          name="select-categories"
          onMenuOpen={onMenuOpen}
          onMenuClose={onMenuClose}
          isMulti
          value={selected}
          isSearchable
          isDisabled={waveCategories.length == 0}
          isLoading={waveCategories.length == 0}
          placeholder={
            waveCategories.length == 0 ? "Loading..." : "Select categories"
          }
          onChange={(e) => setCategories(e as Options[])}
          options={options}
          styles={colourStyles}
        />
        <p style={{ textAlign: "center", fontSize: "12px", paddingTop: "5px" }}>
          All of the above categories are managed in{" "}
          <a href="https://wave.uea.ac.uk" target="_blank" title="WA&VE">
            WA&VE
          </a>
          .
          <br />
          Please contact the{" "}
          <a href="mailto:digital@uea.ac.uk">Digital Inbox</a> for any queries.
        </p>
        <hr />
        <ModalToggle
          isModalOpen={data?.isModalOpen as any}
          setModalOpen={actions?.setModalOpen as any}
        />
      </div>
    </div>
  );
};

export default WAVECategories;

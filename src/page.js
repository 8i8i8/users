import axios from "axios";
import React, { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";

var validate = require("react-email-validator");
var res = require("react-email-validator");
function Page() {
  const [data, changeData] = useState([]);
  const [editItem, changeEditItem] = useState("");
  const [editName, changeEditName] = useState("");
  const [editEmail, changeEditEmail] = useState("");
  const [editRole, changeEditRole] = useState("");
  const [currentPage, changeCurrentPage] = useState(1);
  const [itemsPerPage, changeItemsPerPage] = useState(10);
  const [pageNumberLimit, changePageNumberLimit] = useState(6);
  const [maxPageNumberLimit, changeMaxPageNumberLimit] = useState(6);
  const [minPageNumberLimit, changeMinPageNumberLimit] = useState(0);
  const [checked, changeChecked] = useState([]);
  const [searchInput, changeSearchInput] = useState("");
  const [selectAll, changeSelectAll] = useState(false);
  let dispaly = [];
  const [searchResult, changeSearchResult] = useState([]);

  searchInput ? (dispaly = searchResult) : (dispaly = data);
  const css = (a) => {
    checked.find((r) => {
      if (r === a) {
        return "selected";
      } else return "not";
    });
  };
  const prev = () => {
    changeChecked([]);

    changeSelectAll(false);
    changeCurrentPage(currentPage - 1);

    if (currentPage - 2 < minPageNumberLimit) {
      changeMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      changeMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };
  const next = () => {
    changeChecked([]);

    changeSelectAll(false);
    changeCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      changeMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      changeMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };
  const delette = (b) => {
    changeData(data.filter((a) => a.id != b));
    changeSearchResult(searchResult.filter((a) => a.id != b));
  };
  const edit = (b) => {
    changeEditItem(b.id);
    changeEditRole(b.role);
  };
  const update = (b) => {
    let d = [...data];
    let i = d.findIndex((a) => a.id === b.id);
    editName ? (d[i].name = editName) : (d[i].name = d[i].name);
    editEmail ? (d[i].email = editEmail) : (d[i].email = d[i].email);
    editRole ? (d[i].role = editRole) : (d[i].role = d[i].role);
    changeData(d);
    changeEditItem("");
    changeEditName("");
    changeEditEmail("");
    changeEditRole("");
  };
  const updateChecked = (event, i) => {
    // event.preventDefault();
    let d = [...checked];
    if (event.target.checked) {
      d = [...checked, i];
    } else {
      d.splice(checked.indexOf(i), 1);
    }
    changeChecked(d);
  };
  const deleteComponent = () => {
    if (checked.length) {
      return (
        <div>
          <button
            style={{
              backgroundColor: "#DC4C64",
              color: "black",
              border: "none",
            }}
            className=" btn
          btn-outline-dark"
            onClick={() => {
              let d = [...data];
              d = d.filter(function (item) {
                return !checked.includes(item.id);
              });
              changeData(d);
              changeChecked([]);
              changeEditName("");
              changeEditEmail("");
              changeEditRole("");
            }}
          >
            {checked.length === 1
              ? "delete selected item"
              : `delete selected ${checked.length} items`}
          </button>
        </div>
      );
    }
  };
  const close = () => {
    changeEditItem("");
    changeEditName("");
    changeEditEmail("");
    changeEditRole("");
  };
  const searchBox = (a) => {
    changeCurrentPage(1);
    console.log(a.target.value);
    changeSearchInput(a.target.value);
    let r = data.filter((b) => {
      if (
        b.name.toLowerCase().includes(a.target.value.toLowerCase()) ||
        b.email.toLowerCase().includes(a.target.value.toLowerCase()) ||
        b.role.toLowerCase().includes(a.target.value.toLowerCase())
      ) {
        return b;
      }
    });
    console.log(r);
    changeSearchResult(r);
  };
  const selectall = (e) => {
    if (e.target.checked) {
      let array = [];
      changeSelectAll(true);
      currentItems.map((a) => {
        array.push(a.id);
      });
      changeChecked(array);
    } else {
      changeChecked([]);

      changeSelectAll(false);
    }
  };
  const pages = [];
  for (let a = 1; a <= Math.ceil(dispaly.length / itemsPerPage); a++) {
    pages.push(a);
  }
  const lastIndex = itemsPerPage * currentPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = dispaly.slice(firstIndex, lastIndex);
  const lastPage = pages.slice(-1)[0];
  useEffect(() => {
    if (checked.length > 0 && checked.length === currentItems.length) {
      changeSelectAll(true);
    } else {
      changeSelectAll(false);
    }
  }, [checked, currentItems, currentPage]);
  useEffect(() => {
    // if (searchInput === "") {
    axios
      .get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      )
      .then((response) => changeData(response.data));
  }, []);
  return (
    <div className="con">
      <header className="d-flex" style={{ color: "black" }}>
        <h3 className=" px-5 pt-5 text-start">Web Developer</h3>
        <h3 className="  pt-5 px-5 text-end .d-sm-none .d-md-block">
          <a href="mailto:ar7617@srmist.edu.in" style={{ color: "black" }}>
            <i className="fas fa-envelope" />
          </a>
        </h3>
      </header>
      <input
        className="form-control w-75 m-4 center mx-auto br"
        // className="form-control m-3"
        type="search"
        placeholder="Search by name, email or role"
        value={searchInput}
        onChange={searchBox}
        onKeyUp={searchBox}
      />
      {searchInput && dispaly.length === 0 ? (
        <p>Sorry, nothing was found</p>
      ) : null}
      {dispaly.length > 0 && (
        <div>
          <div className="table-responsive ">
            <table className="table table-fit">
              <thead
                className="black white-text"
                style={{ backgroundColor: "black", color: "white" }}
              >
                <tr className="dark">
                  <th className="col-1">
                    <input
                      className="form-check-input secondary"
                      type="checkbox"
                      style={{
                        borderColor: "black",
                      }}
                      checked={selectAll}
                      onChange={(e) => selectall(e)}
                    />
                  </th>
                  <th className="col-1">Name</th>
                  <th className="col-1">Email</th>
                  <th className="col-1">Role</th>
                  <th className="col-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems &&
                  currentItems.map((a) => {
                    {
                      return editItem && editItem === a.id ? (
                        <tr key={a.id}>
                          <th className="align-middle">
                            <input
                              className="form-check-input custom-control-input"
                              type="checkbox"
                              key={a.id}
                              style={{ borderColor: "black" }}
                              checked={checked.find((r) => {
                                console.log(checked);
                                if (r === a.id) {
                                  return true;
                                } else return false;
                              })}
                            />
                          </th>
                          <td className=" align-middle">
                            <input
                              type="text"
                              placeholder={a.name}
                              value={editName}
                              // style={{ borderBlockColor: "black" }}
                              className="form-control"
                              onChange={(e) => changeEditName(e.target.value)}
                            />
                          </td>{" "}
                          <td className=" align-middle">
                            <input
                              placeholder={a.email}
                              type="text"
                              className="form-control"
                              value={editEmail}
                              onChange={(e) => {
                                changeEditEmail(e.target.value);
                              }}
                            />
                          </td>
                          <td>
                            <p style={{ color: "black" }}>
                              <strong>{editRole}</strong>{" "}
                            </p>

                            <button
                              className="btn btn-outline-dark small"
                              style={{
                                color: "white",
                                backgroundColor: "black",
                              }}
                              onClick={() =>
                                changeEditRole(
                                  editRole === "admin" ? "member" : "admin"
                                )
                              }
                            >
                              {editRole === "admin" ? "member" : "admin"}
                            </button>
                          </td>
                          <td className="col-1 align-middle">
                            <i
                              class="fas fa-times fa-lg mx-2"
                              style={{ color: "black", cursor: "pointer" }}
                              onClick={() => close()}
                            ></i>

                            <i
                              className="fas fa-check mx-2"
                              style={{
                                color: "rgba(126, 239, 104, 0.8)",
                                cursor: "pointer",
                              }}
                              onClick={() => update(a)}
                            />
                            <i
                              className="fas fa-trash  mx-2"
                              style={{ color: "#DC4C64", cursor: "pointer" }}
                              onClick={() => delette(a.id)}
                            />
                          </td>
                        </tr>
                      ) : (
                        <tr key={a.id} className={(a) => css(a.id)}>
                          <th className="col-1 ">
                            <input
                              className="form-check-input  "
                              style={{ color: "#AB47BC" }}
                              type="checkbox"
                              key={a.id}
                              // style={{
                              //   borderColor: "black",
                              //   borderRadius: "1px",
                              //   color: "black",
                              // }}
                              checked={checked.find((r) => {
                                console.log(r, a.id);
                                if (r === a.id) {
                                  console.log(
                                    "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
                                  );
                                  return true;
                                } else return false;
                              })}
                              // onChange={(e) => updateChecked(e, a.id)}
                              onChange={(e) => {
                                console.log(e.target.checked);

                                return updateChecked(e, a.id);
                              }}
                            />
                          </th>
                          <td className="col-1">{a.name}</td> <td>{a.email}</td>
                          <td className="col-1">{a.role}</td>
                          <td className="col-1">
                            <i
                              className="fas fa-user-edit mx-3 "
                              style={{ color: "black", cursor: "pointer" }}
                              onClick={() => edit(a)}
                            />

                            <i
                              className="fas fa-trash  mx-3"
                              style={{ color: "#DC4C64", cursor: "pointer" }}
                              onClick={() => delette(a.id)}
                            />
                          </td>
                        </tr>
                      );
                    }
                  })}
              </tbody>
            </table>
          </div>

          {deleteComponent()}

          <div className="w-150 m-2">
            <button
              onClick={() => {
                if (currentPage != 1) {
                  changeChecked([]);

                  changeSelectAll(false);
                  changeCurrentPage(1);
                  changeMaxPageNumberLimit(6);
                  changeMinPageNumberLimit(0);
                }
              }}
              className={
                currentPage !== 1
                  ? "btn btn-outline-dark m-1"
                  : "btn btn-outline-dark m-1 disabled"
              }
            >
              first
            </button>
            <button
              onClick={prev}
              className={
                currentPage !== 1
                  ? "btn btn-outline-dark m-1"
                  : "btn btn-outline-dark m-1 disabled"
              }
            >
              prev
            </button>

            {pages.map((a) => {
              if (a < maxPageNumberLimit + 1 && a > minPageNumberLimit) {
                return (
                  <span>
                    <button
                      key={a}
                      className={
                        a === currentPage
                          ? "btn btn-dark  m-1 b"
                          : "btn btn-outline-dark  m-1 b"
                      }
                      onClick={() => {
                        changeChecked([]);

                        changeSelectAll(false);
                        return changeCurrentPage(a);
                      }}
                    >
                      {a}
                    </button>
                  </span>
                );
              }
            })}

            <button
              onClick={next}
              className={
                currentPage !== lastPage
                  ? "btn btn-outline-dark m-1"
                  : "btn btn-outline-dark m-1 disabled"
              }
            >
              next
            </button>

            <button
              onClick={() => {
                if (currentPage != lastPage) {
                  changeChecked([]);

                  changeSelectAll(false);
                  changeCurrentPage(lastPage);
                  changeMaxPageNumberLimit(lastPage);
                  changeMinPageNumberLimit(lastPage - pageNumberLimit);
                }
              }}
              className={
                currentPage !== lastPage
                  ? "btn btn-outline-dark m-1"
                  : "btn btn-outline-dark m-1 disabled"
              }
            >
              last
            </button>

            {/* <button onClick={() => changeItemsPerPage(itemsPerPage + 4)}>
            load more
          </button> */}
          </div>
        </div>
      )}
      {data.length > 0 && (
        <footer
          className="p-3 footer"
          style={{ color: "white", backgroundColor: "black" }}
        >
          <a href="mailto:ar7617@srmist.edu.in" style={{ color: "purple" }}>
            Contact us for creating websites <i className="fas fa-envelope" />
          </a>
        </footer>
      )}
    </div>
  );
}

export default Page;

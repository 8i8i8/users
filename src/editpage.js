import axios from "axios";
import React, { useEffect, useState } from "react";

function Page() {
  const [data, changeData] = useState([]);
  const [editItem, changeEditItem] = useState("");
  const [editName, changeEditName] = useState("");
  const [editEmail, changeEditEmail] = useState("");
  const [editRole, changeEditRole] = useState("");
  const [currentPage, changeCurrentPage] = useState(1);
  const [itemsPerPage, changeItemsPerPage] = useState(3);
  const [pageNumberLimit, changePageNumberLimit] = useState(6);
  const [maxPageNumberLimit, changeMaxPageNumberLimit] = useState(6);
  const [minPageNumberLimit, changeMinPageNumberLimit] = useState(0);
  const [checked, changeChecked] = useState([]);
  const [searchInput, changeSearchInput] = useState("");
  const [selectAll, changeSelectAll] = useState(false);

  const [searchResult, changeSearchResult] = useState([]);
  const prev = () => {
    changeCurrentPage(currentPage - 1);
    if (currentPage - 2 < minPageNumberLimit) {
      changeMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      changeMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
  };
  const next = () => {
    changeCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageNumberLimit) {
      changeMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      changeMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
  };
  const delette = (b) => {
    changeData(data.filter((a) => a.id != b));
  };
  const edit = (b) => {
    changeEditItem(b);
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
        <button
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
          delete selected {checked.length} items
        </button>
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
    changeData(r);
  };
  const selectall = (e) => {
    let array = [];
    if (e.target.checked) {
      let newCurrentItems = [];
      if (checked.length) {
        currentItems.map((a) => {
          newCurrentItems.push(a.id);
        });
        array = [...checked];
        array.sort();

        for (let i = 0; i < currentItems.length; i++) {
          for (let j = 0; j < array.length; j++) {
            if (array[j] == currentItems[i].id) {
              newCurrentItems.splice(
                newCurrentItems.indexOf(currentItems[i].id),
                1
              );
            }
          }
        }
        console.log(newCurrentItems);
        array = array.concat(newCurrentItems);

        console.log(array);

        changeChecked(array);
      } else {
        array = [];
        currentItems.map((a) => {
          array.push(a.id);
        });
        changeChecked(array);
      }

      changeSelectAll(true);
    } else {
      array = [...checked];

      array.sort();
      for (let i = 0; i < checked.length; i++) {
        for (let j = 0; j < currentItems.length; j++) {
          console.log(checked[i], currentItems[j].id);
          if (checked[i] === currentItems[j].id) {
            array.splice(array.indexOf(checked[i], 1));
          }
        }
      }

      console.log(array);
      changeChecked(array);
      changeSelectAll(false);
    }
  };
  const pages = [];
  for (let a = 1; a <= Math.ceil(data.length / itemsPerPage); a++) {
    pages.push(a);
  }
  const lastIndex = itemsPerPage * currentPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = data.slice(firstIndex, lastIndex);
  const lastPage = pages.slice(-1)[0];
  useEffect(() => {
    if (checked.length > 0 && checked.length >= currentItems.length) {
      const diff = currentItems.every((el) => checked.includes(el.id));
      console.log(diff);
      if (diff) {
        changeSelectAll(true);
      } else {
        changeSelectAll(false);
      }
    } else {
      changeSelectAll(false);
    }
  }, [checked, currentItems]);
  useEffect(() => {
    if (searchInput === "") {
      axios
        .get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        )
        .then((response) => changeData(response.data));
    }
  }, [searchInput]);
  return (
    <div>
      <input
        type="search"
        placeholder="search... .. .. ."
        value={searchInput}
        onChange={searchBox}
        onKeyUp={searchBox}
      />
      {data.length > 0 && (
        <>
          <table>
            <thead>
              <td>
                select
                <input
                  type="checkbox"
                  // key={a.id}
                  checked={selectAll}
                  onChange={(e) => selectall(e)}
                />
              </td>
              <td>Name</td>
              <td>Email</td>
              <td>Role</td>
              <td>Edit</td>
            </thead>
            <tbody>
              {currentItems &&
                currentItems.map((a) => {
                  {
                    return editItem && editItem == a.id ? (
                      <tr key={a.id}>
                        <td>
                          <input
                            type="checkbox"
                            key={a.id}
                            checked={checked.find((r) => {
                              if (r === a.id) {
                                return true;
                              } else return false;
                            })}
                            onChange={(e) => updateChecked(e, a.id)}
                          />
                        </td>
                        <td>
                          <input
                            placeholder={a.name}
                            type="text"
                            value={editName}
                            // value=""
                            onChange={(e) => changeEditName(e.target.value)}
                          />
                          {console.log(editName)}
                        </td>{" "}
                        <td>
                          <input
                            placeholder={a.email}
                            type="text"
                            // value=""
                            value={editEmail}
                            onChange={(e) => changeEditEmail(e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            placeholder={a.role}
                            type="text"
                            // value=""
                            value={editRole}
                            onChange={(e) => changeEditRole(e.target.value)}
                          />
                        </td>
                        {/* <select
                          value={editRole}
                          onChange={(e) => changeEditRole(e.target.value)}
                        >
                          <option value="admin">admin</option>
                          <option value="member">member</option>
                        </select> */}
                        <td>
                          <button onClick={() => close()}>close</button>
                          <button onClick={() => update(a)}>update</button>
                          <button onClick={() => delette(a.id)}>delete</button>
                        </td>
                      </tr>
                    ) : (
                      <tr key={a.id}>
                        <td>
                          <input
                            type="checkbox"
                            key={a.id}
                            checked={checked.find((r) => {
                              if (r === a.id) {
                                return true;
                              } else return false;
                            })}
                            onChange={(e) => updateChecked(e, a.id)}
                          />
                        </td>
                        <td>{a.name}</td> <td>{a.email}</td>
                        <td>{a.role}</td>
                        <td>
                          <button onClick={() => edit(a.id)}>edit</button>
                          <button onClick={() => delette(a.id)}>delete</button>
                        </td>
                      </tr>
                    );
                  }
                })}
            </tbody>
          </table>

          {deleteComponent()}
          {currentPage !== 1 ? <button onClick={prev}>prev</button> : null}
          {minPageNumberLimit > 1 ? <button onClick={prev}>...</button> : null}
          {pages.map((a) => {
            if (a < maxPageNumberLimit + 1 && a > minPageNumberLimit) {
              return (
                <span>
                  <button
                    key={a}
                    className={currentPage === a ? "activate" : null}
                    onClick={() => changeCurrentPage(a)}
                  >
                    {a}
                  </button>
                </span>
              );
            }
          })}
          {maxPageNumberLimit < pages.length ? (
            <button onClick={next}>...</button>
          ) : null}
          {currentPage !== lastPage ? (
            <button onClick={next}>next</button>
          ) : null}
          <button onClick={() => changeItemsPerPage(itemsPerPage + 4)}>
            load more
          </button>
        </>
      )}
    </div>
  );
}

export default Page;

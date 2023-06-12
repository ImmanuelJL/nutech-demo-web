import React, { useState, useEffect } from 'react';
import {
  useNavigate,
  Link
} from "react-router-dom";
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import '../App.css';
import logo from '../logo.svg';

const Item = () => {
  const navigate = useNavigate();
  const [datas, setDatas] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [errorMessages, setErrorMessages] = useState({});
  const [imgBase64String, setImgBase64String] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('xaccesstoken');

    navigate("/");
  };

  const FetchDataMenu = (page=0, size=5, search='') => {
    axios.get(process.env.REACT_APP_BACKEND_URL + '/api/item?page=' + page + '&size=' + size + '&search=' + search, {headers:{'Authorization' : 'Bearer ' + localStorage.getItem('xaccesstoken')}})
      .then(response => {
        // console.log(response.data.data.dataItems, searchText);
        setDatas(response.data.data.dataItems);
        setPageCount(response.data.data.totalPages);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleChangeSearchText = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    FetchDataMenu(currentPage, 5, searchText);
  }, [searchText]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    FetchDataMenu(event.selected, 5, searchText);
  };

  const toBase64String = (e: ChangeEvent<HTMLInputElement>) => {
    var { photo } = document.forms[0];

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    
    const filesize = e.target.files[0].size;
    const filetype = e.target.files[0].type;

    if (filesize >= 100000) {
      alert('Max 100kb.');

      photo.value = '';
    }

    if (filetype !== 'image/jpeg' && filetype !== 'image/png') {
      alert('Not supported type file (jpg, png only).');

      photo.value = '';
    }

    if (photo.value !== '') {
      reader.onload = function () {
        var result = reader.result.replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', '');
        // console.log(result);
        setImgBase64String(result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    var { data_id, photo, name, price_buy, price_sell, stock } = document.forms[0];

    setErrorMessages({ name: "errorMessage", message: "" });

    var data = JSON.stringify({photo: imgBase64String, name: name.value, price_buy: price_buy.value, price_sell: price_sell.value, stock: stock.value});
    const customConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('xaccesstoken')
      }
    };

    if (data_id.value !== '') { // Edit data...
      if (photo.value === '') {
        data = JSON.stringify({name: name.value, price_buy: price_buy.value, price_sell: price_sell.value, stock: stock.value});
      }

      axios.put(process.env.REACT_APP_BACKEND_URL + '/api/item/' + data_id.value, data, customConfig)
      .then(res => {
        if (res.status === 200) {
          FetchDataMenu(currentPage, 5, searchText);

          data_id.value = '';
          photo.value = '';
          name.value = '';
          price_buy.value = '';
          price_sell.value = '';
          stock.value = '';

          document.getElementById('closeModalBtn').click();
        }
      })
      .catch(error => {
        console.error(error);
        setErrorMessages({ name: "errorMessage", message: error.response.data.data[0] });
      });
    } else { // Create new...
      axios.post(process.env.REACT_APP_BACKEND_URL + '/api/item', data, customConfig)
      .then(res => {
        // console.log(res);
        // console.log(res.data);
        if (res.status === 200) {
          FetchDataMenu(currentPage, 5, searchText);

          data_id.value = '';
          photo.value = '';
          name.value = '';
          price_buy.value = '';
          price_sell.value = '';
          stock.value = '';

          document.getElementById('closeModalBtn').click();
        }
      })
      .catch(error => {
        console.error(error);
        setErrorMessages({ name: "errorMessage", message: error.response.data.data[0] });
      });
    }
  };

  const editData = (id) => {
    var { data_id, photo, name, price_buy, price_sell, stock } = document.forms[0];

    document.getElementById('openModalBtn').click();

    axios.get(process.env.REACT_APP_BACKEND_URL + '/api/item/' + id, {headers:{'Authorization' : 'Bearer ' + localStorage.getItem('xaccesstoken')}})
      .then(response => {
        data_id.value = id;
        photo.value = '';
        name.value = response.data.data.name;
        price_buy.value = response.data.data.price_buy;
        price_sell.value = response.data.data.price_sell;
        stock.value = response.data.data.stock;
      })
      .catch(error => {
        console.error(error);
      });
  };

  const deleteData = (id) => {
    axios.delete(process.env.REACT_APP_BACKEND_URL + '/api/item/' + id, {headers:{'Authorization' : 'Bearer ' + localStorage.getItem('xaccesstoken')}})
      .then(response => {
        FetchDataMenu(currentPage, 5, searchText);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const clearForm = (event) => {
    event.preventDefault();

    var { data_id, photo, name, price_buy, price_sell, stock } = document.forms[0];

    data_id.value = '';
    photo.value = '';
    name.value = '';
    price_buy.value = '';
    price_sell.value = '';
    stock.value = '';

    setErrorMessages({ name: "errorMessage", message: '' });
  };

  const renderErrorMessage = (name) =>
    name === errorMessages.name && (
      <div className="error">{errorMessages.message}</div>
    );

  return (
    <div>

      <nav className="navbar navbar-expand-sm navbar-light bg-white shadow-sm">
        <div className="container">
            <Link to="/item" className="navbar-brand"><img src={logo} className="logo" alt="logo" /></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mynavbar">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="mynavbar">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                      <Link to="/item" className="nav-link">Item</Link>
                  </li>
                </ul>
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
            </div>
        </div>
      </nav>

      <div className="container container-content mt-3">
        <div className="row d-flex justify-content-center">
          <h1>Item</h1>
        </div>
      </div>

      <div className="container container-content mt-3">
        <div className="row d-flex">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-9 col-xl-9 no-padding-left-right mt-2">
            <button id="openModalBtn" className="btn btn-success" data-toggle="modal" data-target="#openModal" onClick={clearForm}>Add</button>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-3 col-xl-3 no-padding-left-right mt-2">
            <input type="search" className="search form-control" placeholder="Search" onChange={handleChangeSearchText} value={searchText} />
          </div>
        </div>
      </div>

      <div className="container container-content mt-3">
        <div className="row d-flex justify-content-center">
          <div className="table-responsive">
            <table id="main-list-table" className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th className="text-center fit">Photo</th>
                    <th className="text-center fit">Name</th>
                    <th className="text-center fit">Price Buy</th>
                    <th className="text-center fit">Price Sell</th>
                    <th className="text-center fit">Stock</th>
                    <th className="text-center fit">Action</th>
                  </tr>
                </thead>
              <tbody>
                {datas.map(data => (
                  <tr key={data.id}>
                    <td className="text-center">
                      <img src={"data:image/*;base64," + data.photo} className="photo-thumbnail" alt={"Photo " + data.id} loading="lazy" />
                    </td>
                    <td className="text-center">{data.name}</td>
                    <td className="text-center">{data.price_buy}</td>
                    <td className="text-center">{data.price_sell}</td>
                    <td className="text-center">{data.stock}</td>
                    <td className="text-center">
                      <button className='btn btn-primary' type="button" onClick={() => editData(data.id)}>Edit</button>
                      &nbsp;
                      <button className='btn btn-danger' type="button" onClick={() => {if(window.confirm('Delete the item?')){deleteData(data.id)};}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="< previous"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
              forcePage={currentPage}
              disableInitialCallback={true}
            />
          </div>
        </div>
      </div>

      <div className="modal fade" id="openModal" tabIndex="-1" aria-labelledby="openModalLabel" aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-body">
                    <form onSubmit={handleSubmit} autoComplete="off">
                      <input type="hidden" className="form-control" name="data_id" />
                      <div className="form-group">
                        <label>Photo</label>
                        <input type="file" className="form-control" name="photo" accept="image/*" onChange={toBase64String} />
                      </div>
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" name="name" required placeholder="Name" />
                      </div>
                      <div className="form-group">
                        <label>Price Buy</label>
                        <input type="number" className="form-control" name="price_buy" required placeholder="0" />
                      </div>
                      <div className="form-group">
                        <label>Price Sell</label>
                        <input type="number" className="form-control" name="price_sell" required placeholder="0" />
                      </div>
                      <div className="form-group">
                        <label>Stock</label>
                        <input type="number" className="form-control" name="stock" required placeholder="0" />
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <button id="submitData" className='btn btn-success' type="submit">Submit</button>
                          &nbsp;
                          <button id="closeModalBtn" className='btn btn-danger' type="button" data-dismiss="modal" onClick={clearForm}>Cancel</button>
                        </div>
                      </div>
                    </form>
                    <div className="mb-1">
                      {renderErrorMessage("errorMessage")}
                    </div>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Item;
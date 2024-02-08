import React, { Component } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import './App.css';

const monthList = [
    {
        id: 1,
        monthId: "03",
        month: "MARCH"
    },
    {
      id: 2,
      monthId: "04",
      month: "APRIL"
    },
    {
      id: 3,
      monthId: "05",
      month: "MAY"
    },
    {
      id: 4,
      monthId: "06",
      month: "JUNE"
    },
    {
      id:5,
      monthId: "07",
      month: "JULY"
    },
    {
      id: 6,
      monthId: "08",
      month: "AUGUST"
    },
    {
      id: 7,
      monthId: "09",
      month: "SEPTEMBER"
    },
    {
      id: 8,
      monthId: "10",
      month: "OCTOBER"
    },
    {
      id: 9,
      monthId: "11",
      month: "NOVEMBER"
    },
    {
      id: 10,
      monthId: "12",
      month: "DECEMBER"
    },
    {
      id: 11,
      monthId: "01",
      month: "JANUARY"
    },
    {
      id: 12,
      monthId: "02",
      month: "FEBRUARY"
    },
]

class App extends Component {
    state = {
        data: [],
        searchInput: '',
        dropDownInput: monthList[0].monthId,
        startIndex: 0,
        endIndex: 10,
        currentPage: 1,
        stats: [],
        barChartData: [],
    }

    componentDidMount() {
        this.renderTransactionInitialData();
        this.getStatistics();
    }

    renderNoOfMonth = () => {
        const { dropDownInput } = this.state;

        return monthList.find(month => month.monthId === dropDownInput)?.monthId ;
    }

    renderTransactionInitialData = async () => {
      const { searchInput } = this.state;
      const month = this.renderNoOfMonth();
        const url = `http://localhost:7575/search/month?searchInput=${searchInput}&dropDownInput=${month}`;
        const response = await fetch(url);
        if (response.ok === true) {
            const apiData = await response.json();
            /* const totalSoldAmount = apiData.reduce((acc, curr) => acc + (curr.sold ? curr.price : 0), 0);
            const totalSoldItems = apiData.filter(item => item.sold === true).length;
            const totalNotSoldItems = apiData.filter(item => item.sold === false).length; */
            this.setState({ data: apiData });
        }
    }

    getStatistics = async () => {
      const {dropDownInput} = this.state;
      const url = `http://localhost:7575/combined-data?dropDownInput=${dropDownInput}`;
      const response = await fetch(url);
      if (response.ok === true) {
        const statsData = await response.json();
        console.log(statsData)
        this.setState({stats: statsData.statistics, barChartData: statsData.barChart});
      }
    }

    onChangeSearchInput = (event) => {
        this.setState({ searchInput: event.target.value }, this.renderTransactionInitialData);
    }

    onChangeDropDown = (event) => {
          this.setState(
            {dropDownInput: event.target.value, startIndex: 0, endIndex: 10, currentPage: 1, searchInput: ''},
            () => {
              this.renderTransactionInitialData();
              this.getStatistics();
            }
          )
    }

    increasePage = () => {
      const {data, currentPage} = this.state
      const totalPages = Math.ceil((data.length) / 10)
      if (currentPage < totalPages) {
        this.setState(prev => ({currentPage: prev.currentPage + 1, startIndex: prev.startIndex + 10, endIndex: prev.endIndex + 10}))
      }
    }

    decreasePage = () => {
      const {currentPage} = this.state
      if (currentPage > 1) {
        this.setState(prev => ({currentPage: prev.currentPage - 1, startIndex: prev.startIndex - 10, endIndex: prev.endIndex - 10}))
      }
    }

    renderPagination = () => {
      const {data, currentPage} = this.state
      const totalPages = Math.ceil((data.length) / 10)

      return (
        <div className='button-container'>
          <button type= "button" onClick={this.decreasePage} disabled={currentPage === 1}>Previous</button>
          <span>{currentPage} / {totalPages}</span>
          <button type="button" onClick={this.increasePage} disabled={currentPage === totalPages}>Next</button>
        </div>
      )
    }

    renderStatistics = () => {
      const {stats} = this.state;
      
      return(
        <div className='statistics-card'>
          <h2>Statistics</h2>
          <div className='stats-card'>
            <p className='p'>Total Sale</p>
            <p>{stats.totalSaleAmount}</p>
          </div>

          <div className='stats-card'>
            <p>Total sold item</p>
            <p>{stats.totalSoldItems}</p>
          </div>

          <div className='stats-card'>
            <p>Total sold item</p>
            <p>{stats.totalNotSoldItems}</p>
          </div>
        </div>
      )
    }

    renderBarChart = () => {
      const {barChartData} = this.state

      return (
        <ResponsiveContainer width="50%" height={300}>
          <BarChart
            data={barChartData}
            width={30}
            height={400}
            margin={{
              top: 5,
            }}
          >
            <XAxis
              dataKey="priceRange"
              tick={{
                stroke: "black",
                strokeWidth: 1,
              }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="itemCount" name="Item Count" fill="#1f77b4" barSize="20%" />
          </BarChart>
        </ResponsiveContainer>
      )
    }
    

    render() {
        const { data, searchInput,  dropDownInput, startIndex, endIndex } = this.state

        return (
            <div className="App">
                <div className='heading-card'>
                <h1>Transaction Dashboard</h1>

                <div className='search-dropdown-container'>
                    <input type='search' value={searchInput} onChange={this.onChangeSearchInput} placeholder="Search transaction"/>
                    <select value={dropDownInput} onChange={this.onChangeDropDown}>
                        {monthList.map(each => (
                            <option key={each.id} value={each.monthId}>{each.month}</option>
                        ))}
                    </select>
                </div>
                </div>

                <hr/>

                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Image</th>
                            <th>Sold</th>
                            <th>dateOfSale</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.slice(startIndex, endIndex).map(each => (
                            <tr key={each.id}>
                                <td>{each.id}</td>
                                <td>{each.title}</td>
                                <td>{each.price}</td>
                                <td>{each.description}</td>
                                <td>{each.category}</td>
                                <td><img src={each.image} alt={each.title} /></td>
                                <td>{each.sold}</td>
                                <td>{each.dateOfSale}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                  {this.renderPagination()}
                </div>
                <div className='statistics-container'>
                  {this.renderStatistics()}
                </div>
                <div className='bar-chart-card'>
                  <h2>Bar Chart Stats</h2>
                  {this.renderBarChart()}
                </div>
            </div>
        )
    }
}

export default App;
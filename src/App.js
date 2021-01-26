import React, { useEffect, useState } from 'react';
import {
	Col,
	Row,
	Typography,
	Input,
	Card,
	Button,
	Space,
	Select,
	Tooltip,
	Pagination,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import './App.css';
import MaleSvg from './Male';
import FemaleSvg from './Female';
import UnisexSvg from './Unisex';

const { Title } = Typography;
const { Search, Group } = Input;
const { Option } = Select;

const filterByOptions = ['Gender', 'PaymentMethod'];
const genderOptions = ['Male', 'Female', 'Prefer to skip'];
const svgGender = gender => {
	if (gender === 'Male') {
		return <MaleSvg />;
	}
	if (gender === 'Female') {
		return <FemaleSvg />;
	}
	if (gender === 'Prefer to skip') {
		return <UnisexSvg />;
	}
};
const paymentMethodOptions = ['cc', 'check', 'money order', 'paypal'];


const suffix = (
	<SearchOutlined
		style={{
			fontSize: 16,
			color: '#1890ff',
		}}
	/>
);

const App = () => {
  const [data, setData] = useState([]);
	const [displayData, setDisplayData] = useState([]);
  const [paginationPage, setPaginationPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [filterOption, setFilterOption] = useState([]);
  const [filterBy, setFilterBy] = useState('');
 
  
  const paginateData = (paginationPage, data) =>
		data && data.length <= 10
			? data
      : data.slice((paginationPage - 1) * 20, paginationPage * 20);
      
      const onSearch = value => {
        setSearchString(value);
        searchString
          ? setDisplayData(
              data.filter(profile => profile.FirstName.toLowerCase() === value.toLowerCase())
            )
          : setDisplayData(paginateData(paginationPage, data));
      };

    const searchReset = () => {
		setSearchString('');
		setDisplayData(paginateData(paginationPage, data));
	};

    const onFilterByChange = value => setFilterBy(value);

    const onFilterChange = value =>
		setDisplayData(
			paginateData(
				paginationPage,
				data.filter(profile => profile[filterBy] === value)
			)
    );
    
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.enye.tech/v1/challenge/records');
        const { records: { profiles } } = await response.json();
        
      setData(profiles);
      } catch (error) {
        console.log(error);
      }
    };
  
 
	useEffect(() => {
		fetchData();
  }, []);
  
  useEffect(() => {
		setDisplayData(paginateData(paginationPage, data));
  }, [paginationPage, data]);
  
  useEffect(() => {
		if (filterBy === 'Gender') {
			setFilterOption(genderOptions);
		}
		if (filterBy === 'PaymentMethod') {
			setFilterOption(paymentMethodOptions);
		}
	}, [filterBy]);
	
	return (
		<div
			className="main"
			style={{
        padding: '20px',
        background: '#F0F5FF',
        margin: 'auto',
			}}
		>
			<div
				className="header"
				style={{
          margin: 'auto',
					textAlign: 'center',
				}}
			>
         <Space direction="vertical" size="middle">
				<Title
					level={2}
					className="header-text"
					style={{
						color: '#262626',
						fontFamily: 'Roboto',
						fontStyle: 'bold',
						fontWeight: 500,
						fontSize: '20px',
					}}
				>
					Okoi’s Enye Profile Manager
				</Title>
				<Row>
					<Space size="middle">
						<Search
							placeholder="Search Profiles by Firstname"
							enterButton="Search"
							size="large"
							suffix={suffix}
							onSearch={onSearch}
						/>

						<Tooltip title="Reset search">
							<Button type="primary" shape="circle" onClick={searchReset}>
								X
							</Button>
						</Tooltip>
					</Space>
				</Row>
        <Group compact>
					<Select
						showSearch
						style={{ width: 200 }}
						placeholder="Select Option to filter by"
						optionFilterProp="children"
						onChange={onFilterByChange}
						filterOption={(input, option) =>
							option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
						}
					>
						{filterByOptions.map(option => (
							<Option key={option} value={option}>
								{option}
							</Option>
						))}
					</Select>
					<Select onChange={onFilterChange} style={{ width: 150 }}>
						{filterOption.map(option => (
							<Option key={option} value={option}>
								{option}
							</Option>
						))}
					</Select>
				</Group>
        </Space>
			</div>
      
      <Row
				className="main"
				justify="center"
				gutter={[16, 16]}
				style={{
					marginTop: '30px',
					padding: '20px',
				}}
			>
				{displayData &&
					displayData.map(profile => (
						<Col key={profile.Email} xs={24} sm={12} md={8} lg={6}>
							<Row justify="center">
								<Card style={{ width: 300, borderRadius: '8px' }}>
									<Row justify="center">
                  <Col span={8}>{svgGender(profile.Gender)}</Col>
										<Col
											span={16}
											style={{
												textAlign: 'right',
												color: '#262626',
												fontStyle: 'normal',
												fontWeight: 600,
												fontSize: '11px',
											}}
										>
											<p>{profile.CreditCardType}</p>
											<p>{profile.CreditCardNumber}</p>
										</Col>
									</Row>
									<Row justify="start" style={{ color: '#595959' }}>
										<p>{`Name: ${profile.FirstName} ${profile.LastName}`}</p>
										<p>{`Email: ${profile.Email}`}</p>
										<p>{`Phone Number: ${profile.PhoneNumber}`}</p>
									</Row>
								</Card>
							</Row>
						</Col>
					))}

			</Row>
      <Row justify="end" style={{ marginTop: '30px', padding: '20px' }}>
			<Pagination defaultCurrent={paginationPage} onChange={setPaginationPage} total={data.length} />
			</Row>
		</div>
	);
};

export default App;
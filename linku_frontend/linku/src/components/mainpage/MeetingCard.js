import React from 'react';
import { connect } from 'react-redux';
import { Container,Card, Button, Dropdown, Menu, Grid, Header, Item, Divider, Icon } from 'semantic-ui-react'

import { bindActionCreators } from 'redux';

import * as actions from '../../actions/Common';

import Apply from './Apply';
import Login from '../login/Login';
import axios from 'axios';

class MeetingCard extends React.Component
{
    constructor(props){
        super(props);

        this.state = {
            selectedValue : undefined,
            participant_num : 0,
            participant_man_num : undefined,
            participant_woman_num : undefined
        };
    }

    _participatedSelectionChange = (e, data) => {
        const current_status = this.props.meetingInfo.status_by_days[data.value];
        this.setState({
            ...this.state,
            selectedValue : data.value,
            participant_num : current_status.participant_num.man + current_status.participant_num.woman,
            participant_man_num : current_status.participant_num.man,
            participant_woman_num : current_status.participant_num.woman,
        });
    }

    componentWillMount(){
        localStorage.setItem('token', undefined);
        localStorage.setItem('user_gender', undefined);
        localStorage.setItem('participated_dates', undefined);
    }

    getDateStr(date) {
        const WEEK_DAY = ["일", "월", "화", "수", "목", "금", "토"];
        const meeting_date = new Date(date);
        return (meeting_date.getMonth() + 1)+ "월 " + meeting_date.getDate() + "일 " + WEEK_DAY[meeting_date.getDay()] + "요일";
    }

    render() {
        const statisticsNumberStyle = {
            color : '#FFFFFF',
        };

        let meetingInfoBackgroundStyle = {
            backgroundColor: '#F8F8F9',
            paddingTop: '3%',
            paddingBottom: '9%'
        };
        let meetingInfoStyle = {
            width: '620px',
            textAlign: 'left',
        };
        let meetingMainInfoStyle = {
            backgroundImage: 'url(http://localhost:8000/media/meeting_card.jpg)',
            paddingTop: '35px',
            paddingLeft: '35px',
            paddingRight: '35px',
            paddingBottom: '210px'
        };
        let meetingDetailInfoStyle = {
            margin: '5%',
            backgroundColor: '#FFFFFF'
        };
        let meetingDetailImageLogoStyle = {
            marginTop: '8px',
            marginLeft: '10px',
            marginRight: '20px',
            width: '80px',
            height: '80px'
        };
        let meetingDetailHeaderStyle = {
            marginLeft: '12px',
            marginBottom: '30px',
            color: '#61a1d8',
            fontSize: '24px'
        };
        let meetingDetailPlanStyle = {
            marginTop: '30px',
            marginLeft: '5%'
        };
        let meetingDetailButtonStyle = {
            padding: '20px',
            backgroundColor: '#5FA1D7',
            fontSize: '14pt',
            height: '60px' ,
            color: '#FFFFFF',
            textAlign: 'center'
        };
        let meetingApplyStyle = {
            marginTop: '0px',
            marginLeft: '1%',
            marginRight: '1%',
            width: '270px',
            height: '360px',
            textAlign: 'center',
        };
        let meetingApplyFontStyle = {
            marginTop: '17px',
            marginLeft: '6px',
            textAlign: 'left',
            fontSize: '12pt',
        };
        let meetingMemberStyle = {
            paddingTop: '20px',
            fontSize: '12pt',
        };

        let meetingDateOptions = [];

        if(this.props.meetingInfo.status_by_days)
        {
            meetingDateOptions = this.props.meetingInfo.status_by_days.map((status, index) => {
                const button_message = this.getDateStr(status.start_time) + " (" + (status.participant_num.man + status.participant_num.woman)
                                        + "/" + status.max_num_of_members + ")명";

                return { key: index, text: button_message, value: index };
            });
        }

        const getBtnByState = () => {
            if(this.state.selectedValue == undefined)
                return (<Button disabled color='blue' fluid>날짜를 선택해주세요</Button>);

            if(this.props.meetingInfo.status_by_days == undefined || this.props.meetingInfo.status_by_days.length == 0)
                return;

            const selected_meeting = this.props.meetingInfo.status_by_days[this.state.selectedValue];
            const user_gender = localStorage.getItem('user_gender');
            let participant_num_by_gender = undefined;

            if(localStorage.getItem('user_gender')=='F')
                participant_num_by_gender = this.state.participant_woman_num;
            else
                participant_num_by_gender = this.state.participant_man_num;

            if((localStorage.getItem('participated_dates')==selected_meeting.start_time) && this.props.loggedIn){
                return (<Button disabled color='blue' fluid>신청완료</Button>);
            }

            else if(participant_num_by_gender >= selected_meeting.max_num_of_members/2 && this.props.loggedIn){
                return (<Button disabled color='blue' fluid>마감되었습니다.</Button>);
            }
            else {
                const button = (<Button style={{backgroundColor:'#5FA1D7',color:'#FFFFFF'}} fluid>같이 놀자!</Button>);
                if(localStorage.getItem('token') && this.props.loggedIn){
                    return (
                        <Apply
                            selectedValue={this.state.selectedValue}
                            paymentInfo={this.getDateStr(selected_meeting.start_time)}
                        />
                    );
                }
                else {
                    return (<Login triggerButton={button}/>);
                }
            }
        };

        return(
            <Container style={meetingInfoBackgroundStyle}>
                <Grid centered>
                    <Card style={meetingInfoStyle}>
                        <Card.Content>
                        <div style={meetingMainInfoStyle}>
                            <div style={{color: "#FFFFFF"}}>
                                <Header style={{color: '#FFFFFF'}} as='h1'>문화예술의 동네 혜화</Header>
                                <div style={{marginTop: '22px'}}>{this.props.meetingInfo.meeting_specific_info}</div>
                            </div>
                        </div>
                        <div style={meetingDetailInfoStyle}>
                            <div>
                                <div style={meetingDetailHeaderStyle}>
                                    모임장
                                </div>
                                <Item.Group>
                                    <Item>
                                        <Item.Image style={meetingDetailImageLogoStyle} src='http://localhost:8000/media/meeting_leader_profile.png' />
                                        <Item.Content>
                                            <Item.Description>
                                                <div style={{lineHeight: '23px'}}>
                                                    대학생이니까 대학로!<br/>
                                                    젊음과 문화, 자유를 만끽할 수 있는 거리 대학로에서 모임 시작합니다.<br/>
                                                    가까운 장소들을 엮어서 피로는 덜하게,<br/>
                                                    맛있는 것도 골라먹고 즐겁게 게임도 하면서<br/>
                                                    하루쯤은 시험과 과제로 쌓인 스트레스를 풀어봐요!<br/>
                                                </div>
                                            </Item.Description>
                                        </Item.Content>
                                    </Item>
                                </Item.Group>
                            </div>
                            <div style={{marginTop: '50px', marginBottom: '50px'}}>
                                <Divider />
                            </div>
                            <div>
                                <div style={meetingDetailHeaderStyle}>
                                    일정
                                </div>
                                <div style={meetingDetailPlanStyle}>
                                    <Item>
                                        <Item.Header style={{marginTop:'20px', marginBottom:'5px'}} as='h4'>17:00 ~ 18:30</Item.Header>
                                        <Item.Description style={{marginLeft: '20px'}}>
                                            <b>호호식당</b><br/>
                                            <a href="https://store.naver.com/restaurants/detail?id=85806567&tab=main">
                                                링크(클릭하면 자세한 정보를 볼 수 있어요.)
                                            </a>
                                        </Item.Description>
                                    </Item>
                                    <Item>
                                        <Item.Header style={{marginTop:'20px', marginBottom:'5px'}} as='h4'>18:30 ~ 19:30</Item.Header>
                                        <Item.Description style={{marginLeft: '20px'}}>
                                            <b>[Yx2 보드게임 카페]로 이동합니다.</b><br/>
                                            <a href="http://www.e114.kr/local/17357">
                                                링크(클릭하면 자세한 정보를 볼 수 있어요.)
                                            </a>
                                        </Item.Description>
                                    </Item>
                                    <Item>
                                        <Item.Header style={{marginTop:'20px', marginBottom:'5px'}} as='h4'>19:30 ~ 20:00</Item.Header>
                                        <Item.Description style={{marginLeft: '20px'}}>
                                            <b>[우리 게임랜드]</b><br/>
                                            <a href="https://ko.foursquare.com/v/%EC%9A%B0%EB%A6%AC%EA%B2%8C%EC%9E%84%EB%9E%9C%EB%93%9C/5045b997e4b08a16a4467aac">
                                                링크(클릭하면 자세한 정보를 볼 수 있어요.)
                                            </a>
                                        </Item.Description>
                                    </Item>
                                    <Item>
                                        <Item.Header style={{marginTop:'20px', marginBottom:'5px'}} as='h4'>20:00 ~ </Item.Header>
                                        <Item.Description style={{marginLeft: '20px'}}>
                                            <b>[심야식당]으로 이동합니다. (조금 멀어도 칵테일이 당긴다면 [인생의 단맛]을 추천드려요.)</b><br/>
                                            <a href="http://blog.naver.com/PostView.nhn?blogId=wndus508&logNo=220976731706">
                                                링크(클릭하면 자세한 정보를 볼 수 있어요.)
                                            </a>
                                        </Item.Description>
                                    </Item>
                                </div>
                            </div>
                        </div>
                        </Card.Content>
                    </Card>
                    <Card style={meetingApplyStyle}>
                        <Card.Content>
                            <Card.Header>
                                <Menu compact style={{marginBottom: '10px', width: '240px'}}>
                                    <Dropdown placeholder='클릭해서 날짜 선택하기' onChange = {this._participatedSelectionChange} selection options={meetingDateOptions} fluid/>
                                </Menu>
                            </Card.Header>
                            <Card.Description>
                                <div style={meetingApplyFontStyle}><strong>시간</strong> : 17:00</div>
                                <div style={meetingApplyFontStyle}><strong>장소</strong> : {this.props.meetingInfo.place}</div>
                                <div style={meetingApplyFontStyle}><strong>인원</strong> : 한 모임당 6명(모임장 1명 포함)</div>
                                <div style={meetingApplyFontStyle}>
                                    <strong>현재 참여인원 </strong>
                                    <div style={meetingMemberStyle}>
                                        <Icon style={{paddingBottom:'30px'}} name='woman' color='pink' size='large'/> {this.state.participant_woman_num} 명 <br/>
                                        <Icon name='man' color='blue' size='large'/>  {this.state.participant_man_num} 명
                                    </div>
                                </div>
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            {getBtnByState()}
                        </Card.Content>
                    </Card>
                </Grid>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loggedIn : state.login.loggedIn
    }
};
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(MeetingCard);

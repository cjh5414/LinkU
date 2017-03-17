import pytest
import datetime
import json
from meeting.models import Meeting
from meeting.serializer import MeetingSerializer


@pytest.mark.django_db
def test_json_header_when_meetings_GET_request(client):
    response = client.get('/meetings/')

    assert 200 == response.status_code
    assert "application/json" == response.get('content-type')


@pytest.mark.django_db
def test_create_meeting_model():
    Meeting.objects.create(maker_name='test maker_name',
                           title='test title',
                           start_time=datetime.datetime.now(),
                           place='test place',
                           price=5000,
                           num_of_joined_members=1,
                           max_num_of_members=6,
                           meeting_specific_info='test meeting_specific_info',
                           restaurant_name='test restaurant_name',
                           category='tes category',
                           specific_link='test specific_link')
    Meeting.objects.get(maker_name='test maker_name')


@pytest.mark.django_db
def test_correct_json_data_when_meetings_GET_request(client):
    meeting1 = Meeting.objects.create(maker_name='test maker_name1',
                                      title='test title1',
                                      start_time=datetime.datetime.now(),
                                      place='test place1',
                                      price=5000,
                                      num_of_joined_members=1,
                                      max_num_of_members=6,
                                      meeting_specific_info='test meeting_specific_info1',
                                      restaurant_name='test restaurant_name1',
                                      category='tes category1',
                                      specific_link='test specific_link1')

    meeting2 = Meeting.objects.create(maker_name='test maker_name2',
                                      title='test title2',
                                      start_time=datetime.datetime.now(),
                                      place='test place2',
                                      price=6000,
                                      num_of_joined_members=1,
                                      max_num_of_members=6,
                                      meeting_specific_info='test meeting_specific_info2',
                                      restaurant_name='test restaurant_name2',
                                      category='tes category2',
                                      specific_link='test specific_link2')
    response = client.get('/meetings/' + "?format=json")
    meetings = [MeetingSerializer(meeting1).data,
                MeetingSerializer(meeting2).data]
    assert response.data == meetings


@pytest.mark.django_db
def test_correct_json_data_when_meeting_GET_request(client):
    meeting = Meeting.objects.create(maker_name='test maker_name',
                                     title='test title',
                                     start_time=datetime.datetime.now(),
                                     place='test place',
                                     price=5000,
                                     num_of_joined_members=1,
                                     max_num_of_members=6,
                                     meeting_specific_info='test meeting_specific_info',
                                     restaurant_name='test restaurant_name',
                                     category='tes category',
                                     specific_link='test specific_link')

    response = client.get('/meetings/' + str(meeting.id) + "/?format=json")
    assert response.data == MeetingSerializer(meeting).data

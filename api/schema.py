import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

from .models import Timer as TimerModel

class Timer(SQLAlchemyObjectType):
    class Meta:
        model = TimerModel
        interfaces = (relay.Node, )

class TimerConnection(relay.Connection):
    class Meta:
        node = Timer

class Query(graphene.ObjectType):
    node = relay.Node.Field()

    all_timers = SQLAlchemyConnectionField(TimerConnection)

schema = graphene.Schema(query=Query)

from mongoengine import (
    Document,
    StringField,
    FloatField,
    IntField,
    BooleanField,
    DateTimeField,
)
from datetime import datetime


class Designer(Document):
    name = StringField(required=True)
    email = StringField(required=True)
    ratings = FloatField(
        required=True,
        min_value=0.5,
        max_value=5,
        choices=[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    )
    projects = IntField(required=True)
    phone = StringField(required=True)
    description = StringField(required=True)
    isShortlisted = BooleanField(required=True, default=False)
    years = IntField(required=True, min_value=0)
    price = FloatField(required=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)

    meta = {"collection": "designers"}

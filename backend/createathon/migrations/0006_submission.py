# Generated by Django 5.1.7 on 2025-03-19 17:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('createathon', '0005_discussion_testcase_question'),
    ]

    operations = [
        migrations.CreateModel(
            name='Submission',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('code', models.TextField()),
                ('languages', models.CharField(max_length=50)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('rejected', 'Rejected')], default='pending', max_length=20)),
                ('submitted_at', models.DateTimeField(auto_now_add=True)),
                ('question_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to='createathon.question')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='submissions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-submitted_at'],
            },
        ),
    ]

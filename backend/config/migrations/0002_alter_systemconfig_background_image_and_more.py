# Generated by Django 5.1.4 on 2024-12-11 18:11

import config.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('config', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='systemconfig',
            name='background_image',
            field=models.ImageField(blank=True, null=True, upload_to=config.models.upload_to_background),
        ),
        migrations.AlterField(
            model_name='systemconfig',
            name='favicon',
            field=models.ImageField(blank=True, null=True, upload_to=config.models.upload_to_favicon),
        ),
        migrations.AlterField(
            model_name='systemconfig',
            name='logo',
            field=models.ImageField(blank=True, null=True, upload_to=config.models.upload_to_logo),
        ),
    ]
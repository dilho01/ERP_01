# Generated by Django 5.1.4 on 2024-12-11 15:26

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SystemConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('logo', models.ImageField(blank=True, null=True, upload_to='logos/')),
                ('background_image', models.ImageField(blank=True, null=True, upload_to='backgrounds/')),
                ('favicon', models.ImageField(blank=True, null=True, upload_to='favicons/')),
            ],
        ),
    ]

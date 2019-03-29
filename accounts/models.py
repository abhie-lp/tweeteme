from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.files.base import ContentFile
from django.db.models.signals import post_save

from PIL import Image


def image_dest(instance, filename, thumbnail=False):
    main_directory = "profile"
    if thumbnail:
        main_directory = "thumbnail"
    time = timezone.now().strftime("%Y-%m-%d--%H-%M-%S")
    username = instance.user.username
    directory = username
    extension = filename.rsplit(".", 1)[1]
    file = str(time) + "." + extension
    return "/".join([main_directory, directory, file])


def thumb_dest(instance, filename):
    return image_dest(instance, filename, thumbnail=True)


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_pic = models.ImageField(upload_to=image_dest, default="default.jpg")
    profile_thumb = models.ImageField(upload_to=thumb_dest, default="default.jpg", blank=True)
    following = models.ManyToManyField(User, blank=True, related_name="following_me")

    def __init__(self, *args, **kwargs):
        super(UserProfile, self).__init__(*args, **kwargs)
        self.__curr_image = self.profile_pic
        self.__curr_thumb = self.profile_thumb

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        # Check if the instance is created for the first time or not.. If it is first time than self.id will be None
        if getattr(self, "id"):
            # Store the new picture in a variable to assign it later
            new = self.profile_pic

            # Check if the current_image is not "default.jpg" and the image field has changed
            if self.__curr_image.name != self.profile_pic.name:
                if self.__curr_image.name != "default.jpg":
                    self.__curr_image.delete(False)  # Delete the current image
                    self.__curr_thumb.delete(False)  # Delete the current thumbnail
                    self.profile_pic = new  # Assign the new image to self.profile

                self.profile_thumb.save("thumb.jpg", ContentFile(new.read()), False)  # Assign same to thumbnail

                # Save the changes to model
                super(UserProfile, self).save(*args, **kwargs)

                # Resize the thumbnail image
                thumb_path = self.profile_thumb.path
                img = Image.open(thumb_path)
                output_size = (300, 300)
                if img.height > 300 or img.weight > 300:
                    img.thumbnail(output_size)
                    img.save(thumb_path)
                return

        super(UserProfile, self).save(*args, **kwargs)

    def delete(self, using=None, keep_parents=False):
        self.profile_thumb.delete(False)
        self.profile_pic.delete(False)
        super(UserProfile, self).delete(using=None, keep_parents=False)


def new_profile(sender, instance, created, *args, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)


post_save.connect(new_profile, sender=User)

from django.forms import ModelForm  # noqa
from django.core.exceptions import ValidationError
from .models import Property  # noqa


class PropertyForm(ModelForm):
    class Meta:
        model = Property
        fields = (
            "category",
            "title",
            "description",
            "price_per_night",
            "bedrooms",
            "bathrooms",
            "guests",
            'country',
            'country_code',
            "image",
        )

    def clean_image(self):
        image = self.cleaned_data.get('image')

        # Validate the image file extension (check if it's PNG, JPG, or JPEG)
        if image:
            if not image.name.endswith(('jpg', 'jpeg', 'png')):
                raise ValidationError("Invalid file type. Please upload a PNG, JPG, or JPEG image.")
        return image

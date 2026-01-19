# Email Configuration Guide

## Gmail Setup Instructions

To send emails from your Django application using Gmail, you need to create an **App Password** instead of using your regular Gmail password.

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com/
2. Click on **Security** in the left sidebar
3. Under "Signing in to Google", find **2-Step Verification**
4. Follow the prompts to enable it (if not already enabled)

### Step 2: Generate an App Password

1. Go back to **Security** settings
2. Under "Signing in to Google", find **App passwords**
3. You might need to sign in again
4. Select **Mail** as the app
5. Select **Other (Custom name)** as the device
6. Type "Django Portfolio" or any name you prefer
7. Click **Generate**
8. **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 3: Create/Update .env File

1. Create a file named `.env` in the `backend/` directory
2. Add the following content:

```env
# Django Settings
SECRET_KEY=django-insecure-change-this-in-production-use-secret-key-generator
DEBUG=True

# Email Configuration for Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=alyaarihazem@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password-here
DEFAULT_FROM_EMAIL=alyaarihazem@gmail.com
```

3. Replace `your-16-character-app-password-here` with the App Password you generated (remove spaces, it should be exactly 16 characters)

### Step 4: Restart Django Server

After creating/updating the `.env` file, restart your Django development server:

1. Stop the server (press `Ctrl+C` in the terminal)
2. Restart it:
   ```bash
   cd backend
   venv\Scripts\activate
   python manage.py runserver
   ```

### Testing

1. Test the endpoint using Swagger: http://127.0.0.1:8000/swagger/
2. Submit a test message
3. Check your Gmail inbox (alyaarihazem@gmail.com) for the notification email
4. Check the Django server console for any email errors

### Troubleshooting

**If emails still don't send:**

1. **Check the Django server console** - Look for error messages like:
   - "Error sending email: ..."
   - "Email configuration is missing..."

2. **Verify the app password:**
   - Must be exactly 16 characters (no spaces)
   - Should be the App Password, not your regular Gmail password

3. **Check 2-Step Verification:**
   - Must be enabled on your Google account
   - App Passwords only work with 2-Step Verification enabled

4. **Verify email settings:**
   - `EMAIL_HOST_USER` should be your full Gmail address
   - `EMAIL_HOST_PASSWORD` should be the 16-character App Password

5. **Alternative settings (if TLS doesn't work):**
   ```env
   EMAIL_USE_TLS=False
   EMAIL_USE_SSL=True
   EMAIL_PORT=465
   ```

### Quick Test: Console Email Backend

For testing without sending real emails, you can temporarily change the email backend in `settings.py`:

```python
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
```

This will print emails to the console instead of sending them, so you can verify the email content is correct.

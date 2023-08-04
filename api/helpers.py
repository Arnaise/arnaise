from django.core.mail import send_mail

from django.conf import settings


def email_interaction(data, user, action):
    print(f"INTERACTION TO {action['name']}")
    subject = f"Interaction to {'BUY' if action['name'] == 'BUYING' else 'SELL'}"
    message = f"""Interacted user to {"BUY" if action['name'] == "BUYING" else "SELL"}
Company Name: {user['companyName']}
Company Web: {user['companyURL']}
Contact Person Full Name: {user['fullName']}
Phone Number: +{user['countryCode']}{user['phoneNumber']}
Email: {user['email']}

{"BUYER" if action['name'] == "BUYING" else "SELLER"} request
Product Name: {data['name']}
Action: {data['action']['name']}
Category: {data['category']['name']}
Quantity: {data['quantity']}{data['measurement']['name']}
Price: {data['price']}{data['currency']['name']}
Payment: {data['payment']['name']}
Delivery: {data['delivery']['name']}
Contract: {data['contract']['name']}

{"BUYER" if data['action']['name'] == "BUYING" else "SELLER"}
Company Name: {data['by']['companyName']}
Company Web: {data['by']['companyURL']}
Contact Person Full Name: {data['by']['fullName']}
Phone Number: +{data['by']['countryCode']}{data['by']['phoneNumber']}
Email: {data['by']['email']}
"""
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [
        settings.EMAIL_OF_ADMIN
    ]  # Assuming the recipient is the same as the seller's email
    try:
        send_mail(subject, message, email_from, recipient_list, fail_silently=False)
        print("Sending mail... [SUCCESS]")
    except Exception as e:
        print("Sending mail... [ERROR]")
        print("[ERROR]", e)
    return True


def email_new_listing(data):
    print(f"NEW PRODUCT LISTED FOR {data['action']['name']}")
    subject = f"{data['action']['name']} New Product"
    message = f"""{"BUYER" if data['action']['name'] == "BUYING" else "SELLER"} request
Product Name: {data['name']}
Action: {data['action']['name']}
Category: {data['category']['name']}
Quantity: {data['quantity']}{data['measurement']['name']}
Price: {data['price']}{data['currency']['name']}
Payment: {data['payment']['name']}
Delivery: {data['delivery']['name']}
Contract: {data['contract']['name']}

{"BUYER" if data['action']['name'] == "BUYING" else "SELLER"}
Company Name: {data['by']['companyName']}
Company Web: {data['by']['companyURL']}
Contact Person Full Name: {data['by']['fullName']}
Phone Number: +{data['by']['countryCode']}{data['by']['phoneNumber']}
Email: {data['by']['email']}
"""
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [
        settings.EMAIL_OF_ADMIN
    ]  # Assuming the recipient is the same as the seller's email
    try:
        send_mail(subject, message, email_from, recipient_list, fail_silently=False)
        print("Sending mail... [SUCCESS]")
    except Exception as e:
        print("Sending mail... [ERROR]")
        print("[ERROR]", e)
    return True

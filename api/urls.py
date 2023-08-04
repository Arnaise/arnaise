from django.urls import path, re_path
from . import views

urlpatterns = [
    path("options", views.options, name="options"),
    path("products", views.products, name="products"),
    re_path(r"^products/(?P<pk>[0-9]+)$", views.products),
    path("interactions", views.interactions, name="interactions"),
    re_path(r"^interactions/(?P<pk>[0-9]+)$", views.interactions),
    # path("terms", views.terms, name="terms"),
    # path("team", views.team, name="team"),
    # path("quotes", views.quotes, name="quotes"),
    # path("menus", views.menus, name="menus"),
    # path("submenus", views.submenus, name="submenus"),
    # path("exercises", views.exercises, name="exercises"),
    # path("viewOnExercises", views.viewOnExercises, name="viewOnExercises"),
    # path("getCompletionRate", views.getCompletionRate, name="getCompletionRate"),
    # path("subscribeToNewsletter", views.subscribeToNewsletter, name="subscribeToNewsletter"),
    # path("subscriptionTypes", views.subscriptionTypes, name="subscriptionTypes"),
    # path("makePayment", views.makePayment, name="makePayment"),
    # path("subscriptions", views.subscriptions, name="subscriptions"),
    # path("report", views.report, name="report"),
]

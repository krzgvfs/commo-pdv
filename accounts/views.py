from django.shortcuts import render
from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth import authenticate
from accounts.forms import CustomUserCreationForm
from django.shortcuts import (
    render,
    redirect,
)

# Create your views here.
class SignUpView(generic.CreateView):
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('login')
    template_name = 'accounts/signup.html'

def login_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('home')
        else:
            form = CustomUserLoginForm()
        return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')
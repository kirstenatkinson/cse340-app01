-- Insert a new account into account table
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
) VALUES (
	'Tony',
	'Stark',
	'tony@starkent.com',
	'Iam1ronM@n'
)

UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com'

DELETE
FROM public.account
WHERE account_email = 'tony@starkent.com'
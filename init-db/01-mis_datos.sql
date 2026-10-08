--
-- PostgreSQL database dump
--

\restrict gQikuFqhODyqnQ8rOWfR5aedUfFrl5LDwM6IUmnGgA6FtoYHW93akgKfhasS3Au

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg13+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.seguidores DROP CONSTRAINT IF EXISTS seguidores_seguidor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.seguidores DROP CONSTRAINT IF EXISTS seguidores_seguido_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_coche_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publicacion_likes DROP CONSTRAINT IF EXISTS publicacion_likes_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publicacion_likes DROP CONSTRAINT IF EXISTS publicacion_likes_publicacion_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publicacion_comentarios DROP CONSTRAINT IF EXISTS publicacion_comentarios_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.publicacion_comentarios DROP CONSTRAINT IF EXISTS publicacion_comentarios_publicacion_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notificaciones DROP CONSTRAINT IF EXISTS notificaciones_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.notificaciones DROP CONSTRAINT IF EXISTS notificaciones_actor_id_fkey;
ALTER TABLE IF EXISTS ONLY public.me_gusta DROP CONSTRAINT IF EXISTS me_gusta_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.me_gusta DROP CONSTRAINT IF EXISTS me_gusta_coche_id_fkey;
ALTER TABLE IF EXISTS ONLY public.comentarios DROP CONSTRAINT IF EXISTS comentarios_usuario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.comentarios DROP CONSTRAINT IF EXISTS comentarios_coche_id_fkey;
ALTER TABLE IF EXISTS ONLY public.coches DROP CONSTRAINT IF EXISTS coches_propietario_id_fkey;
ALTER TABLE IF EXISTS ONLY public.coche_fotos DROP CONSTRAINT IF EXISTS coche_fotos_coche_id_fkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_pkey;
ALTER TABLE IF EXISTS ONLY public.usuarios DROP CONSTRAINT IF EXISTS usuarios_email_key;
ALTER TABLE IF EXISTS ONLY public.seguidores DROP CONSTRAINT IF EXISTS seguidores_pkey;
ALTER TABLE IF EXISTS ONLY public.publicaciones DROP CONSTRAINT IF EXISTS publicaciones_pkey;
ALTER TABLE IF EXISTS ONLY public.publicacion_likes DROP CONSTRAINT IF EXISTS publicacion_likes_pkey;
ALTER TABLE IF EXISTS ONLY public.publicacion_comentarios DROP CONSTRAINT IF EXISTS publicacion_comentarios_pkey;
ALTER TABLE IF EXISTS ONLY public.notificaciones DROP CONSTRAINT IF EXISTS notificaciones_pkey;
ALTER TABLE IF EXISTS ONLY public.me_gusta DROP CONSTRAINT IF EXISTS me_gusta_pkey;
ALTER TABLE IF EXISTS ONLY public.comentarios DROP CONSTRAINT IF EXISTS comentarios_pkey;
ALTER TABLE IF EXISTS ONLY public.coches DROP CONSTRAINT IF EXISTS coches_pkey;
ALTER TABLE IF EXISTS ONLY public.coche_fotos DROP CONSTRAINT IF EXISTS coche_fotos_pkey;
ALTER TABLE IF EXISTS ONLY public._migraciones DROP CONSTRAINT IF EXISTS _migraciones_pkey;
ALTER TABLE IF EXISTS ONLY public._migraciones DROP CONSTRAINT IF EXISTS _migraciones_nombre_key;
ALTER TABLE IF EXISTS public.usuarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.publicaciones ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.publicacion_comentarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.notificaciones ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.comentarios ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.coches ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.coche_fotos ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public._migraciones ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.usuarios_id_seq;
DROP TABLE IF EXISTS public.usuarios;
DROP TABLE IF EXISTS public.seguidores;
DROP SEQUENCE IF EXISTS public.publicaciones_id_seq;
DROP TABLE IF EXISTS public.publicaciones;
DROP TABLE IF EXISTS public.publicacion_likes;
DROP SEQUENCE IF EXISTS public.publicacion_comentarios_id_seq;
DROP TABLE IF EXISTS public.publicacion_comentarios;
DROP SEQUENCE IF EXISTS public.notificaciones_id_seq;
DROP TABLE IF EXISTS public.notificaciones;
DROP TABLE IF EXISTS public.me_gusta;
DROP SEQUENCE IF EXISTS public.comentarios_id_seq;
DROP TABLE IF EXISTS public.comentarios;
DROP SEQUENCE IF EXISTS public.coches_id_seq;
DROP TABLE IF EXISTS public.coches;
DROP SEQUENCE IF EXISTS public.coche_fotos_id_seq;
DROP TABLE IF EXISTS public.coche_fotos;
DROP SEQUENCE IF EXISTS public._migraciones_id_seq;
DROP TABLE IF EXISTS public._migraciones;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _migraciones; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public._migraciones (
    id integer NOT NULL,
    nombre character varying(255) NOT NULL,
    aplicada_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public._migraciones OWNER TO admin;

--
-- Name: _migraciones_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public._migraciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public._migraciones_id_seq OWNER TO admin;

--
-- Name: _migraciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public._migraciones_id_seq OWNED BY public._migraciones.id;


--
-- Name: coche_fotos; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.coche_fotos (
    id integer NOT NULL,
    coche_id integer NOT NULL,
    foto_url character varying(255) NOT NULL,
    orden integer DEFAULT 0
);


ALTER TABLE public.coche_fotos OWNER TO admin;

--
-- Name: coche_fotos_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.coche_fotos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coche_fotos_id_seq OWNER TO admin;

--
-- Name: coche_fotos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.coche_fotos_id_seq OWNED BY public.coche_fotos.id;


--
-- Name: coches; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.coches (
    id integer NOT NULL,
    marca character varying(50) NOT NULL,
    modelo character varying(50) NOT NULL,
    "año" integer,
    propietario_id integer,
    descripcion text,
    foto_url character varying(255),
    potencia_cv integer,
    kilometraje integer,
    color character varying(50)
);


ALTER TABLE public.coches OWNER TO admin;

--
-- Name: coches_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.coches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coches_id_seq OWNER TO admin;

--
-- Name: coches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.coches_id_seq OWNED BY public.coches.id;


--
-- Name: comentarios; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.comentarios (
    id integer NOT NULL,
    coche_id integer,
    usuario_id integer,
    contenido text NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comentarios OWNER TO admin;

--
-- Name: comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comentarios_id_seq OWNER TO admin;

--
-- Name: comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.comentarios_id_seq OWNED BY public.comentarios.id;


--
-- Name: me_gusta; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.me_gusta (
    usuario_id integer NOT NULL,
    coche_id integer NOT NULL
);


ALTER TABLE public.me_gusta OWNER TO admin;

--
-- Name: notificaciones; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.notificaciones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    actor_id integer NOT NULL,
    tipo character varying(30) NOT NULL,
    referencia_id integer,
    leida boolean DEFAULT false,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notificaciones OWNER TO admin;

--
-- Name: notificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.notificaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notificaciones_id_seq OWNER TO admin;

--
-- Name: notificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.notificaciones_id_seq OWNED BY public.notificaciones.id;


--
-- Name: publicacion_comentarios; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.publicacion_comentarios (
    id integer NOT NULL,
    publicacion_id integer NOT NULL,
    usuario_id integer NOT NULL,
    contenido text NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.publicacion_comentarios OWNER TO admin;

--
-- Name: publicacion_comentarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.publicacion_comentarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publicacion_comentarios_id_seq OWNER TO admin;

--
-- Name: publicacion_comentarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.publicacion_comentarios_id_seq OWNED BY public.publicacion_comentarios.id;


--
-- Name: publicacion_likes; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.publicacion_likes (
    usuario_id integer NOT NULL,
    publicacion_id integer NOT NULL
);


ALTER TABLE public.publicacion_likes OWNER TO admin;

--
-- Name: publicaciones; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.publicaciones (
    id integer NOT NULL,
    usuario_id integer NOT NULL,
    coche_id integer,
    texto text,
    imagen_url character varying(255),
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.publicaciones OWNER TO admin;

--
-- Name: publicaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.publicaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.publicaciones_id_seq OWNER TO admin;

--
-- Name: publicaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.publicaciones_id_seq OWNED BY public.publicaciones.id;


--
-- Name: seguidores; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.seguidores (
    seguidor_id integer NOT NULL,
    seguido_id integer NOT NULL,
    creado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.seguidores OWNER TO admin;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    bio text,
    avatar_url character varying(255)
);


ALTER TABLE public.usuarios OWNER TO admin;

--
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO admin;

--
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: admin
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- Name: _migraciones id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._migraciones ALTER COLUMN id SET DEFAULT nextval('public._migraciones_id_seq'::regclass);


--
-- Name: coche_fotos id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coche_fotos ALTER COLUMN id SET DEFAULT nextval('public.coche_fotos_id_seq'::regclass);


--
-- Name: coches id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coches ALTER COLUMN id SET DEFAULT nextval('public.coches_id_seq'::regclass);


--
-- Name: comentarios id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios ALTER COLUMN id SET DEFAULT nextval('public.comentarios_id_seq'::regclass);


--
-- Name: notificaciones id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notificaciones ALTER COLUMN id SET DEFAULT nextval('public.notificaciones_id_seq'::regclass);


--
-- Name: publicacion_comentarios id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicacion_comentarios ALTER COLUMN id SET DEFAULT nextval('public.publicacion_comentarios_id_seq'::regclass);


--
-- Name: publicaciones id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicaciones ALTER COLUMN id SET DEFAULT nextval('public.publicaciones_id_seq'::regclass);


--
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- Data for Name: _migraciones; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public._migraciones (id, nombre, aplicada_en) FROM stdin;
1	001_schema_inicial.sql	2026-08-16 19:18:23.247928
2	002_perfiles.sql	2026-08-16 19:18:23.343349
\.


--
-- Data for Name: coche_fotos; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.coche_fotos (id, coche_id, foto_url, orden) FROM stdin;
2	15	/uploads/1787078713904-54f5c2cc32e0.png	0
\.


--
-- Data for Name: coches; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.coches (id, marca, modelo, "año", propietario_id, descripcion, foto_url, potencia_cv, kilometraje, color) FROM stdin;
13	Porsche	911 (964)	1991	23	Restaurado íntegramente en 2023.	\N	\N	\N	\N
14	Nissan	Skyline GT-R R34	1999	24	Preparación ligera de escape y suspensión.	\N	\N	\N	\N
15	jaguar	f type	\N	22	cool	/uploads/1787065880796-58226bcbe4f7.png	340	135000	gris
12	Renault	5 Turbo	\N	22	Icono del rally de Grupo B.	\N	\N	450000	\N
16	Peugeot	208 GTI	2006	25	\N	https://loremflickr.com/800/600/car,peugeot/all?lock=46	186	181310	Amarillo
17	Renault	Megane RS	2009	25	\N	https://loremflickr.com/800/600/car,renault/all?lock=47	110	57617	Rojo
18	Honda	Civic Type R	2009	26	\N	https://loremflickr.com/800/600/car,honda/all?lock=48	444	219749	Negro
19	Mini	Cooper S	1996	26	\N	https://loremflickr.com/800/600/car,mini/all?lock=49	425	95460	Verde
20	Mazda	MX-5	2011	26	\N	https://loremflickr.com/800/600/car,mazda/all?lock=50	510	122501	Azul
21	Ford	Mustang	2014	27	\N	https://loremflickr.com/800/600/car,ford/all?lock=51	273	124512	Rojo
22	Opel	Corsa GSI	2012	27	\N	https://loremflickr.com/800/600/car,opel/all?lock=52	274	124010	Verde
23	Mitsubishi	Lancer Evo	2020	28	\N	https://loremflickr.com/800/600/car,mitsubishi/all?lock=53	423	157633	Verde
24	Dodge	Challenger	2001	29	\N	https://loremflickr.com/800/600/car,dodge/all?lock=54	275	154711	Blanco
25	Opel	Corsa GSI	2006	29	\N	https://loremflickr.com/800/600/car,opel/all?lock=55	351	131076	Plata
26	Mazda	MX-5	1992	29	\N	https://loremflickr.com/800/600/car,mazda/all?lock=56	310	202616	Azul
27	Toyota	Supra	2013	30	\N	https://loremflickr.com/800/600/car,toyota/all?lock=57	178	99838	Negro
28	Ford	Mustang	2017	30	\N	https://loremflickr.com/800/600/car,ford/all?lock=58	168	186327	Azul
29	Porsche	Cayman	1998	30	\N	https://loremflickr.com/800/600/car,porsche/all?lock=59	96	115572	Blanco
30	Mitsubishi	Lancer Evo	2021	31	\N	https://loremflickr.com/800/600/car,mitsubishi/all?lock=60	402	142449	Plata
31	Seat	Ibiza Cupra	2000	31	\N	https://loremflickr.com/800/600/car,seat/all?lock=61	494	106641	Blanco
32	Fiat	500 Abarth	2012	31	\N	https://loremflickr.com/800/600/car,fiat/all?lock=62	272	170924	Rojo
33	BMW	M3	2006	32	\N	https://loremflickr.com/800/600/car,bmw/all?lock=63	615	17835	Azul
34	Mercedes-AMG	GT	1998	32	\N	https://loremflickr.com/800/600/car,mercedesamg/all?lock=64	455	8207	Negro
35	Subaru	Impreza WRX	2008	32	\N	https://loremflickr.com/800/600/car,subaru/all?lock=65	350	125771	Gris
36	Dodge	Challenger	2007	33	\N	https://loremflickr.com/800/600/car,dodge/all?lock=66	482	101080	Gris
37	Mini	Cooper S	2020	33	\N	https://loremflickr.com/800/600/car,mini/all?lock=67	632	109089	Amarillo
38	Renault	Megane RS	2013	34	\N	https://loremflickr.com/800/600/car,renault/all?lock=68	380	190809	Plata
39	Seat	Ibiza Cupra	2008	34	\N	https://loremflickr.com/800/600/car,seat/all?lock=69	261	155661	Blanco
40	Honda	Civic Type R	2024	35	\N	https://loremflickr.com/800/600/car,honda/all?lock=70	645	47280	Rojo
41	Nissan	370Z	2025	35	\N	https://loremflickr.com/800/600/car,nissan/all?lock=71	296	108476	Negro
42	Citroen	Saxo VTS	2009	35	\N	https://loremflickr.com/800/600/car,citroen/all?lock=72	597	206291	Blanco
43	Mazda	MX-5	2000	36	\N	https://loremflickr.com/800/600/car,mazda/all?lock=73	539	151099	Gris
44	Alfa Romeo	Giulia	2016	36	\N	https://loremflickr.com/800/600/car,alfaromeo/all?lock=74	238	205283	Verde
45	Mini	Cooper S	2025	36	\N	https://loremflickr.com/800/600/car,mini/all?lock=75	94	57281	Naranja
46	Mazda	MX-5	1992	37	\N	https://loremflickr.com/800/600/car,mazda/all?lock=76	320	58913	Plata
47	Alfa Romeo	Giulia	1996	38	\N	https://loremflickr.com/800/600/car,alfaromeo/all?lock=77	581	209344	Blanco
48	Fiat	500 Abarth	2006	38	\N	https://loremflickr.com/800/600/car,fiat/all?lock=78	438	211607	Rojo
49	Citroen	Saxo VTS	2019	39	\N	https://loremflickr.com/800/600/car,citroen/all?lock=79	432	158941	Plata
50	BMW	M3	2016	39	\N	https://loremflickr.com/800/600/car,bmw/all?lock=80	346	181899	Blanco
51	Chevrolet	Camaro	1996	39	\N	https://loremflickr.com/800/600/car,chevrolet/all?lock=81	140	148493	Blanco
52	Ford	Mustang	2017	40	\N	https://loremflickr.com/800/600/car,ford/all?lock=82	317	12690	Naranja
53	Chevrolet	Camaro	1994	40	\N	https://loremflickr.com/800/600/car,chevrolet/all?lock=83	648	137564	Plata
54	Porsche	Cayman	2023	41	\N	https://loremflickr.com/800/600/car,porsche/all?lock=84	348	189477	Plata
55	Dodge	Challenger	2012	42	\N	https://loremflickr.com/800/600/car,dodge/all?lock=85	561	108060	Plata
56	Audi	RS4	2004	42	\N	https://loremflickr.com/800/600/car,audi/all?lock=86	269	127000	Blanco
57	Renault	Megane RS	2021	42	\N	https://loremflickr.com/800/600/car,renault/all?lock=87	330	488	Verde
58	Mitsubishi	Lancer Evo	2012	43	\N	https://loremflickr.com/800/600/car,mitsubishi/all?lock=88	649	23183	Naranja
59	Toyota	Supra	2008	44	\N	https://loremflickr.com/800/600/car,toyota/all?lock=89	304	216366	Blanco
60	Chevrolet	Camaro	2024	44	\N	https://loremflickr.com/800/600/car,chevrolet/all?lock=90	135	133130	Rojo
61	Mini	Cooper S	2018	44	\N	https://loremflickr.com/800/600/car,mini/all?lock=91	486	214191	Verde
62	Subaru	Impreza WRX	1991	45	\N	https://loremflickr.com/800/600/car,subaru/all?lock=92	295	209557	Verde
63	Seat	Ibiza Cupra	2003	46	\N	https://loremflickr.com/800/600/car,seat/all?lock=93	461	33764	Verde
64	Nissan	370Z	1997	46	\N	https://loremflickr.com/800/600/car,nissan/all?lock=94	641	4858	Verde
65	Toyota	Supra	2013	47	\N	https://loremflickr.com/800/600/car,toyota/all?lock=95	353	57164	Blanco
66	Skoda	Fabia RS	1995	47	\N	https://loremflickr.com/800/600/car,skoda/all?lock=96	124	116805	Negro
67	Mazda	MX-5	1992	48	\N	https://loremflickr.com/800/600/car,mazda/all?lock=97	230	135974	Plata
68	Mercedes-AMG	GT	2016	48	\N	https://loremflickr.com/800/600/car,mercedesamg/all?lock=98	494	68355	Plata
69	Seat	Ibiza Cupra	1994	49	\N	https://loremflickr.com/800/600/car,seat/all?lock=99	534	196711	Negro
70	Volkswagen	Golf GTI	1991	49	\N	https://loremflickr.com/800/600/car,volkswagen/all?lock=100	114	137803	Naranja
71	Peugeot	208 GTI	2014	50	\N	https://loremflickr.com/800/600/car,peugeot/all?lock=101	524	217133	Negro
72	Renault	Megane RS	1994	51	\N	https://loremflickr.com/800/600/car,renault/all?lock=102	523	46499	Verde
73	Ford	Mustang	1990	51	\N	https://loremflickr.com/800/600/car,ford/all?lock=103	206	148607	Verde
74	Volvo	C30	1999	52	\N	https://loremflickr.com/800/600/car,volvo/all?lock=104	117	208730	Plata
75	Citroen	Saxo VTS	2003	52	\N	https://loremflickr.com/800/600/car,citroen/all?lock=105	368	44882	Blanco
76	Nissan	370Z	1999	53	\N	https://loremflickr.com/800/600/car,nissan/all?lock=106	361	139668	Gris
77	Dodge	Challenger	2000	53	\N	https://loremflickr.com/800/600/car,dodge/all?lock=107	331	60680	Verde
78	Honda	Civic Type R	2022	53	\N	https://loremflickr.com/800/600/car,honda/all?lock=108	405	158207	Gris
79	Skoda	Fabia RS	2016	54	\N	https://loremflickr.com/800/600/car,skoda/all?lock=109	462	205847	Amarillo
80	Subaru	Impreza WRX	2022	54	\N	https://loremflickr.com/800/600/car,subaru/all?lock=110	588	153546	Azul
81	Citroen	Saxo VTS	2012	55	\N	https://loremflickr.com/800/600/car,citroen/all?lock=111	481	148959	Verde
82	Skoda	Fabia RS	2016	55	\N	https://loremflickr.com/800/600/car,skoda/all?lock=112	216	42707	Negro
83	BMW	M3	1999	55	\N	https://loremflickr.com/800/600/car,bmw/all?lock=113	481	123251	Verde
84	Mini	Cooper S	2025	56	\N	https://loremflickr.com/800/600/car,mini/all?lock=114	555	168047	Gris
85	Peugeot	208 GTI	1993	56	\N	https://loremflickr.com/800/600/car,peugeot/all?lock=115	183	187742	Verde
86	Volkswagen	Golf GTI	2017	56	\N	https://loremflickr.com/800/600/car,volkswagen/all?lock=116	628	181347	Plata
87	Mini	Cooper S	2003	57	\N	https://loremflickr.com/800/600/car,mini/all?lock=117	634	32850	Verde
88	Audi	RS4	2002	57	\N	https://loremflickr.com/800/600/car,audi/all?lock=118	529	138448	Naranja
89	Porsche	Cayman	2018	57	\N	https://loremflickr.com/800/600/car,porsche/all?lock=119	625	54109	Plata
90	Opel	Corsa GSI	2008	58	\N	https://loremflickr.com/800/600/car,opel/all?lock=120	364	184098	Negro
91	Honda	Civic Type R	2022	58	\N	https://loremflickr.com/800/600/car,honda/all?lock=121	509	103263	Verde
92	Toyota	Supra	1998	58	\N	https://loremflickr.com/800/600/car,toyota/all?lock=122	641	19353	Negro
93	Audi	RS4	1996	59	\N	https://loremflickr.com/800/600/car,audi/all?lock=123	377	149688	Gris
94	Mercedes-AMG	GT	1991	60	\N	https://loremflickr.com/800/600/car,mercedesamg/all?lock=124	287	97853	Naranja
95	Skoda	Fabia RS	2025	60	\N	https://loremflickr.com/800/600/car,skoda/all?lock=125	225	31024	Gris
96	Seat	Ibiza Cupra	2001	60	\N	https://loremflickr.com/800/600/car,seat/all?lock=126	286	213309	Amarillo
97	Volkswagen	Golf GTI	2022	61	\N	https://loremflickr.com/800/600/car,volkswagen/all?lock=127	329	66750	Rojo
98	Volvo	C30	2018	61	\N	https://loremflickr.com/800/600/car,volvo/all?lock=128	488	87042	Rojo
99	Skoda	Fabia RS	2010	62	\N	https://loremflickr.com/800/600/car,skoda/all?lock=129	214	52525	Verde
100	Toyota	Supra	2019	63	\N	https://loremflickr.com/800/600/car,toyota/all?lock=130	310	197018	Gris
101	Mitsubishi	Lancer Evo	1992	64	\N	https://loremflickr.com/800/600/car,mitsubishi/all?lock=131	587	26506	Gris
102	Fiat	500 Abarth	2024	65	\N	https://loremflickr.com/800/600/car,fiat/all?lock=132	460	132250	Blanco
103	Peugeot	208 GTI	2000	65	\N	https://loremflickr.com/800/600/car,peugeot/all?lock=133	429	18625	Plata
104	Chevrolet	Camaro	2010	65	\N	https://loremflickr.com/800/600/car,chevrolet/all?lock=134	396	202008	Plata
105	Renault	Megane RS	2022	66	\N	https://loremflickr.com/800/600/car,renault/all?lock=135	616	172736	Amarillo
106	Ford	Mustang	2006	66	\N	https://loremflickr.com/800/600/car,ford/all?lock=136	569	131052	Plata
107	Volkswagen	Golf GTI	2007	66	\N	https://loremflickr.com/800/600/car,volkswagen/all?lock=137	492	212757	Naranja
108	Alfa Romeo	Giulia	2023	67	\N	https://loremflickr.com/800/600/car,alfaromeo/all?lock=138	233	180356	Plata
109	Alfa Romeo	Giulia	2002	68	\N	https://loremflickr.com/800/600/car,alfaromeo/all?lock=139	223	119497	Rojo
110	Mercedes-AMG	GT	2019	68	\N	https://loremflickr.com/800/600/car,mercedesamg/all?lock=140	175	77785	Naranja
111	Honda	Civic Type R	2000	68	\N	https://loremflickr.com/800/600/car,honda/all?lock=141	538	14350	Gris
112	Mazda	MX-5	2011	69	\N	https://loremflickr.com/800/600/car,mazda/all?lock=142	647	165534	Amarillo
\.


--
-- Data for Name: comentarios; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.comentarios (id, coche_id, usuario_id, contenido, fecha_registro) FROM stdin;
9	16	30	¡Brutal!	2026-08-22 15:12:26.59753
10	16	51	Quiero uno igual	2026-08-22 15:12:26.59753
11	17	42	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
12	17	69	Me encanta el color	2026-08-22 15:12:26.59753
13	17	62	¡Brutal!	2026-08-22 15:12:26.59753
14	20	29	Quiero uno igual	2026-08-22 15:12:26.59753
15	20	65	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
16	22	44	Menuda bestia 🔥	2026-08-22 15:12:26.59753
17	22	40	¡Brutal!	2026-08-22 15:12:26.59753
18	22	68	Menuda bestia 🔥	2026-08-22 15:12:26.59753
19	22	66	Suena de maravilla seguro	2026-08-22 15:12:26.59753
20	22	42	¡Qué pasada!	2026-08-22 15:12:26.59753
21	23	33	¡Brutal!	2026-08-22 15:12:26.59753
22	23	62	Impresionante acabado	2026-08-22 15:12:26.59753
23	23	49	Impresionante acabado	2026-08-22 15:12:26.59753
24	23	25	¡Brutal!	2026-08-22 15:12:26.59753
25	23	32	¡Qué pasada!	2026-08-22 15:12:26.59753
26	24	40	¡Qué pasada!	2026-08-22 15:12:26.59753
27	24	36	Se ve genial así	2026-08-22 15:12:26.59753
28	24	51	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
29	24	35	¡Qué pasada!	2026-08-22 15:12:26.59753
30	24	46	¡Qué pasada!	2026-08-22 15:12:26.59753
31	25	56	Un clásico como pocos	2026-08-22 15:12:26.59753
32	25	34	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
33	25	44	¡Qué pasada!	2026-08-22 15:12:26.59753
34	25	29	Impresionante acabado	2026-08-22 15:12:26.59753
35	25	60	Se ve genial así	2026-08-22 15:12:26.59753
36	26	38	Me encanta el color	2026-08-22 15:12:26.59753
37	26	45	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
38	27	60	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
39	27	57	Suena de maravilla seguro	2026-08-22 15:12:26.59753
40	27	53	¡Qué pasada!	2026-08-22 15:12:26.59753
41	27	69	¿Está en venta?	2026-08-22 15:12:26.59753
42	28	55	Quiero uno igual	2026-08-22 15:12:26.59753
43	28	57	Suena de maravilla seguro	2026-08-22 15:12:26.59753
44	28	32	Impresionante acabado	2026-08-22 15:12:26.59753
45	28	37	¿Está en venta?	2026-08-22 15:12:26.59753
46	29	56	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
47	29	53	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
48	29	59	Menuda bestia 🔥	2026-08-22 15:12:26.59753
49	29	29	Quiero uno igual	2026-08-22 15:12:26.59753
50	29	60	Me encanta el color	2026-08-22 15:12:26.59753
51	30	45	Suena de maravilla seguro	2026-08-22 15:12:26.59753
52	30	32	Menuda bestia 🔥	2026-08-22 15:12:26.59753
53	31	28	Suena de maravilla seguro	2026-08-22 15:12:26.59753
54	31	61	¡Brutal!	2026-08-22 15:12:26.59753
55	31	58	¿Está en venta?	2026-08-22 15:12:26.59753
56	31	57	Me encanta el color	2026-08-22 15:12:26.59753
57	32	62	Me encanta el color	2026-08-22 15:12:26.59753
58	32	48	Un clásico como pocos	2026-08-22 15:12:26.59753
59	33	46	¿Está en venta?	2026-08-22 15:12:26.59753
60	33	48	Suena de maravilla seguro	2026-08-22 15:12:26.59753
61	33	49	Suena de maravilla seguro	2026-08-22 15:12:26.59753
62	33	29	Suena de maravilla seguro	2026-08-22 15:12:26.59753
63	34	56	¿Está en venta?	2026-08-22 15:12:26.59753
64	35	45	Suena de maravilla seguro	2026-08-22 15:12:26.59753
65	35	43	Impresionante acabado	2026-08-22 15:12:26.59753
66	35	46	Menuda bestia 🔥	2026-08-22 15:12:26.59753
67	35	65	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
68	37	65	Se ve genial así	2026-08-22 15:12:26.59753
69	37	51	Un clásico como pocos	2026-08-22 15:12:26.59753
70	37	28	¿Está en venta?	2026-08-22 15:12:26.59753
71	37	48	Me encanta el color	2026-08-22 15:12:26.59753
72	37	62	¡Qué pasada!	2026-08-22 15:12:26.59753
73	38	51	¡Brutal!	2026-08-22 15:12:26.59753
74	38	41	¡Qué pasada!	2026-08-22 15:12:26.59753
75	38	54	¡Brutal!	2026-08-22 15:12:26.59753
76	40	49	Se ve genial así	2026-08-22 15:12:26.59753
77	40	33	Suena de maravilla seguro	2026-08-22 15:12:26.59753
78	40	42	Suena de maravilla seguro	2026-08-22 15:12:26.59753
79	41	52	¡Qué pasada!	2026-08-22 15:12:26.59753
80	41	40	¿Está en venta?	2026-08-22 15:12:26.59753
81	42	61	Me encanta el color	2026-08-22 15:12:26.59753
82	42	58	Me encanta el color	2026-08-22 15:12:26.59753
83	42	32	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
84	42	65	Se ve genial así	2026-08-22 15:12:26.59753
85	44	62	Impresionante acabado	2026-08-22 15:12:26.59753
86	44	31	¡Qué pasada!	2026-08-22 15:12:26.59753
87	44	28	¿Está en venta?	2026-08-22 15:12:26.59753
88	45	42	Impresionante acabado	2026-08-22 15:12:26.59753
89	45	53	¡Brutal!	2026-08-22 15:12:26.59753
90	45	67	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
91	46	37	¡Qué pasada!	2026-08-22 15:12:26.59753
92	47	57	Un clásico como pocos	2026-08-22 15:12:26.59753
93	47	66	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
94	48	52	Quiero uno igual	2026-08-22 15:12:26.59753
95	48	34	¿Está en venta?	2026-08-22 15:12:26.59753
96	48	30	¡Brutal!	2026-08-22 15:12:26.59753
97	48	33	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
98	48	57	¡Brutal!	2026-08-22 15:12:26.59753
99	49	56	Suena de maravilla seguro	2026-08-22 15:12:26.59753
100	51	28	Menuda bestia 🔥	2026-08-22 15:12:26.59753
101	51	30	Impresionante acabado	2026-08-22 15:12:26.59753
102	51	51	Me encanta el color	2026-08-22 15:12:26.59753
103	52	65	Suena de maravilla seguro	2026-08-22 15:12:26.59753
104	52	25	¡Qué pasada!	2026-08-22 15:12:26.59753
105	52	57	Suena de maravilla seguro	2026-08-22 15:12:26.59753
106	53	61	Suena de maravilla seguro	2026-08-22 15:12:26.59753
107	53	58	¡Brutal!	2026-08-22 15:12:26.59753
108	53	33	Suena de maravilla seguro	2026-08-22 15:12:26.59753
109	53	52	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
110	53	47	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
111	54	55	Un clásico como pocos	2026-08-22 15:12:26.59753
112	54	32	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
113	54	66	Se ve genial así	2026-08-22 15:12:26.59753
114	55	58	Se ve genial así	2026-08-22 15:12:26.59753
115	55	31	Un clásico como pocos	2026-08-22 15:12:26.59753
116	55	30	Menuda bestia 🔥	2026-08-22 15:12:26.59753
117	55	68	¡Brutal!	2026-08-22 15:12:26.59753
118	57	30	Un clásico como pocos	2026-08-22 15:12:26.59753
119	57	59	Menuda bestia 🔥	2026-08-22 15:12:26.59753
120	57	29	¡Brutal!	2026-08-22 15:12:26.59753
121	57	28	¡Brutal!	2026-08-22 15:12:26.59753
122	57	25	Impresionante acabado	2026-08-22 15:12:26.59753
123	58	29	Impresionante acabado	2026-08-22 15:12:26.59753
124	58	64	Me encanta el color	2026-08-22 15:12:26.59753
125	58	63	Un clásico como pocos	2026-08-22 15:12:26.59753
126	58	36	¿Está en venta?	2026-08-22 15:12:26.59753
127	58	31	Me encanta el color	2026-08-22 15:12:26.59753
128	59	38	Se ve genial así	2026-08-22 15:12:26.59753
129	59	54	¡Qué pasada!	2026-08-22 15:12:26.59753
130	60	41	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
131	60	67	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
132	60	33	Un clásico como pocos	2026-08-22 15:12:26.59753
133	61	25	Suena de maravilla seguro	2026-08-22 15:12:26.59753
134	61	49	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
135	61	59	¿Está en venta?	2026-08-22 15:12:26.59753
136	61	38	¡Qué pasada!	2026-08-22 15:12:26.59753
137	62	67	¡Qué pasada!	2026-08-22 15:12:26.59753
138	62	42	Impresionante acabado	2026-08-22 15:12:26.59753
139	62	57	Suena de maravilla seguro	2026-08-22 15:12:26.59753
140	63	62	Suena de maravilla seguro	2026-08-22 15:12:26.59753
141	63	64	¡Qué pasada!	2026-08-22 15:12:26.59753
142	63	69	¿Está en venta?	2026-08-22 15:12:26.59753
143	63	51	Se ve genial así	2026-08-22 15:12:26.59753
144	64	43	Se ve genial así	2026-08-22 15:12:26.59753
145	64	30	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
146	64	26	Un clásico como pocos	2026-08-22 15:12:26.59753
147	64	44	Suena de maravilla seguro	2026-08-22 15:12:26.59753
148	65	37	¿Está en venta?	2026-08-22 15:12:26.59753
149	65	48	Suena de maravilla seguro	2026-08-22 15:12:26.59753
150	65	42	¡Brutal!	2026-08-22 15:12:26.59753
151	65	47	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
152	66	25	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
153	66	57	Se ve genial así	2026-08-22 15:12:26.59753
154	66	45	¡Brutal!	2026-08-22 15:12:26.59753
155	66	51	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
156	66	44	Suena de maravilla seguro	2026-08-22 15:12:26.59753
157	67	33	Impresionante acabado	2026-08-22 15:12:26.59753
158	67	67	Me encanta el color	2026-08-22 15:12:26.59753
159	67	55	Suena de maravilla seguro	2026-08-22 15:12:26.59753
160	68	61	Menuda bestia 🔥	2026-08-22 15:12:26.59753
161	69	27	Me encanta el color	2026-08-22 15:12:26.59753
162	69	38	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
163	69	53	Se ve genial así	2026-08-22 15:12:26.59753
164	70	39	¡Qué pasada!	2026-08-22 15:12:26.59753
165	70	68	¿Está en venta?	2026-08-22 15:12:26.59753
166	70	60	¡Brutal!	2026-08-22 15:12:26.59753
167	70	25	Me encanta el color	2026-08-22 15:12:26.59753
168	70	45	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
169	71	28	Quiero uno igual	2026-08-22 15:12:26.59753
170	72	25	Suena de maravilla seguro	2026-08-22 15:12:26.59753
171	72	42	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
172	72	49	Quiero uno igual	2026-08-22 15:12:26.59753
173	72	58	Suena de maravilla seguro	2026-08-22 15:12:26.59753
174	72	59	Un clásico como pocos	2026-08-22 15:12:26.59753
175	74	28	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
176	75	55	Impresionante acabado	2026-08-22 15:12:26.59753
177	75	27	Suena de maravilla seguro	2026-08-22 15:12:26.59753
178	75	63	Se ve genial así	2026-08-22 15:12:26.59753
179	76	49	¡Qué pasada!	2026-08-22 15:12:26.59753
180	76	39	Se ve genial así	2026-08-22 15:12:26.59753
181	76	51	Menuda bestia 🔥	2026-08-22 15:12:26.59753
182	76	60	¿Está en venta?	2026-08-22 15:12:26.59753
183	77	39	Impresionante acabado	2026-08-22 15:12:26.59753
184	77	55	Se ve genial así	2026-08-22 15:12:26.59753
185	77	33	¡Brutal!	2026-08-22 15:12:26.59753
186	77	67	¿Está en venta?	2026-08-22 15:12:26.59753
187	77	49	Suena de maravilla seguro	2026-08-22 15:12:26.59753
188	78	42	Me encanta el color	2026-08-22 15:12:26.59753
189	78	58	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
190	78	50	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
191	79	63	¡Qué pasada!	2026-08-22 15:12:26.59753
192	80	61	Quiero uno igual	2026-08-22 15:12:26.59753
193	81	38	Un clásico como pocos	2026-08-22 15:12:26.59753
194	81	36	Un clásico como pocos	2026-08-22 15:12:26.59753
195	81	27	Impresionante acabado	2026-08-22 15:12:26.59753
196	82	26	Un clásico como pocos	2026-08-22 15:12:26.59753
197	83	43	¡Brutal!	2026-08-22 15:12:26.59753
198	83	27	¡Qué pasada!	2026-08-22 15:12:26.59753
199	83	44	Un clásico como pocos	2026-08-22 15:12:26.59753
200	83	32	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
201	83	64	¡Brutal!	2026-08-22 15:12:26.59753
202	85	69	Menuda bestia 🔥	2026-08-22 15:12:26.59753
203	85	31	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
204	85	57	Impresionante acabado	2026-08-22 15:12:26.59753
205	86	44	Suena de maravilla seguro	2026-08-22 15:12:26.59753
206	86	27	Impresionante acabado	2026-08-22 15:12:26.59753
207	86	59	Me encanta el color	2026-08-22 15:12:26.59753
208	87	35	Un clásico como pocos	2026-08-22 15:12:26.59753
209	87	29	Suena de maravilla seguro	2026-08-22 15:12:26.59753
210	87	43	¡Qué pasada!	2026-08-22 15:12:26.59753
211	88	29	¡Brutal!	2026-08-22 15:12:26.59753
212	89	27	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
213	89	42	Me encanta el color	2026-08-22 15:12:26.59753
214	89	48	Menuda bestia 🔥	2026-08-22 15:12:26.59753
215	89	67	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
216	90	32	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
217	91	65	Quiero uno igual	2026-08-22 15:12:26.59753
218	91	46	¡Brutal!	2026-08-22 15:12:26.59753
219	91	47	Quiero uno igual	2026-08-22 15:12:26.59753
220	91	37	Quiero uno igual	2026-08-22 15:12:26.59753
221	91	58	Se ve genial así	2026-08-22 15:12:26.59753
222	92	55	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
223	92	33	Impresionante acabado	2026-08-22 15:12:26.59753
224	92	37	Se ve genial así	2026-08-22 15:12:26.59753
225	92	42	Quiero uno igual	2026-08-22 15:12:26.59753
226	92	31	Quiero uno igual	2026-08-22 15:12:26.59753
227	93	53	¿Está en venta?	2026-08-22 15:12:26.59753
228	93	42	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
229	93	34	Menuda bestia 🔥	2026-08-22 15:12:26.59753
230	93	63	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
231	94	35	Suena de maravilla seguro	2026-08-22 15:12:26.59753
232	94	40	¡Brutal!	2026-08-22 15:12:26.59753
233	94	57	¿Está en venta?	2026-08-22 15:12:26.59753
234	95	66	Suena de maravilla seguro	2026-08-22 15:12:26.59753
235	95	26	Quiero uno igual	2026-08-22 15:12:26.59753
236	95	30	Quiero uno igual	2026-08-22 15:12:26.59753
237	96	41	Quiero uno igual	2026-08-22 15:12:26.59753
238	96	47	Quiero uno igual	2026-08-22 15:12:26.59753
239	97	58	Un clásico como pocos	2026-08-22 15:12:26.59753
240	97	52	Impresionante acabado	2026-08-22 15:12:26.59753
241	97	45	Se ve genial así	2026-08-22 15:12:26.59753
242	97	42	¡Brutal!	2026-08-22 15:12:26.59753
243	97	44	Impresionante acabado	2026-08-22 15:12:26.59753
244	98	55	Un clásico como pocos	2026-08-22 15:12:26.59753
245	99	29	Me encanta el color	2026-08-22 15:12:26.59753
246	100	36	¡Qué pasada!	2026-08-22 15:12:26.59753
247	100	25	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
248	100	51	Quiero uno igual	2026-08-22 15:12:26.59753
249	100	69	¡Brutal!	2026-08-22 15:12:26.59753
250	101	34	Menuda bestia 🔥	2026-08-22 15:12:26.59753
251	101	32	Enhorabuena por el trabajo	2026-08-22 15:12:26.59753
252	101	47	Quiero uno igual	2026-08-22 15:12:26.59753
253	101	48	Menuda bestia 🔥	2026-08-22 15:12:26.59753
254	102	60	Me encanta el color	2026-08-22 15:12:26.59753
255	102	34	Quiero uno igual	2026-08-22 15:12:26.59753
256	103	27	¡Brutal!	2026-08-22 15:12:26.59753
257	103	68	¡Brutal!	2026-08-22 15:12:26.59753
258	104	59	Menuda bestia 🔥	2026-08-22 15:12:26.59753
259	104	51	Me encanta el color	2026-08-22 15:12:26.59753
260	104	30	Me encanta el color	2026-08-22 15:12:26.59753
261	105	48	¡Brutal!	2026-08-22 15:12:26.59753
262	106	34	Menuda bestia 🔥	2026-08-22 15:12:26.59753
263	106	51	Suena de maravilla seguro	2026-08-22 15:12:26.59753
264	106	63	¡Brutal!	2026-08-22 15:12:26.59753
265	106	54	Me encanta el color	2026-08-22 15:12:26.59753
266	106	31	¿Está en venta?	2026-08-22 15:12:26.59753
267	108	57	Impresionante acabado	2026-08-22 15:12:26.59753
268	108	29	Menuda bestia 🔥	2026-08-22 15:12:26.59753
269	109	43	Suena de maravilla seguro	2026-08-22 15:12:26.59753
270	110	41	¿Está en venta?	2026-08-22 15:12:26.59753
271	110	39	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
272	110	31	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
273	110	42	¿Cuántos caballos tiene?	2026-08-22 15:12:26.59753
274	111	40	Un clásico como pocos	2026-08-22 15:12:26.59753
275	111	35	¡Brutal!	2026-08-22 15:12:26.59753
276	111	29	Menuda bestia 🔥	2026-08-22 15:12:26.59753
277	111	60	¡Brutal!	2026-08-22 15:12:26.59753
278	111	38	¡Qué pasada!	2026-08-22 15:12:26.59753
279	112	39	Un clásico como pocos	2026-08-22 15:12:26.59753
280	112	62	Impresionante acabado	2026-08-22 15:12:26.59753
\.


--
-- Data for Name: me_gusta; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.me_gusta (usuario_id, coche_id) FROM stdin;
48	16
46	16
43	16
63	16
34	16
65	16
39	16
69	16
53	16
58	16
30	16
41	16
33	16
57	16
66	16
49	16
67	16
40	16
37	16
27	17
65	17
51	17
54	17
58	17
29	17
33	17
56	17
40	17
48	17
26	17
43	17
42	17
68	17
47	17
52	17
49	17
65	18
59	18
30	18
27	18
58	18
44	18
67	18
52	18
36	18
62	18
32	18
35	18
40	18
25	18
41	18
61	18
63	18
33	18
43	18
31	18
48	18
56	18
25	19
45	19
27	19
68	19
40	19
58	19
43	19
63	19
48	19
38	20
46	20
61	20
63	20
54	20
31	20
39	20
26	20
59	20
62	20
40	20
65	20
27	20
51	20
26	21
57	21
52	21
58	21
69	21
46	21
50	22
66	22
61	22
65	22
69	22
63	22
58	22
51	22
60	22
46	22
52	22
59	22
56	22
55	22
63	23
64	23
35	23
58	23
46	23
44	23
54	23
37	23
68	24
58	24
28	24
35	24
49	24
41	25
26	25
66	25
67	25
49	25
33	25
54	25
32	25
52	25
68	25
30	25
62	25
37	25
58	25
47	25
48	25
28	25
50	25
38	25
65	25
56	25
60	25
40	25
32	26
63	26
65	26
43	26
48	26
35	26
65	27
48	27
36	27
68	27
32	27
49	27
51	27
39	27
31	27
42	27
41	27
27	27
28	28
61	28
46	28
33	29
45	29
30	29
40	29
27	29
32	29
35	29
64	29
49	29
28	29
31	29
69	29
57	29
29	29
60	29
36	29
67	29
46	29
36	30
50	30
63	30
42	30
60	30
26	30
33	30
51	30
45	30
31	30
32	30
29	30
48	30
27	30
30	31
39	31
25	31
33	31
41	32
50	32
32	32
63	32
62	32
30	32
43	32
61	32
53	32
37	32
65	32
55	32
25	32
60	32
25	33
32	33
66	33
68	33
31	33
54	33
47	33
50	33
44	33
56	33
42	33
59	33
46	33
36	33
59	34
39	34
37	34
38	34
45	35
43	35
68	35
36	35
49	36
29	36
31	36
66	36
38	36
47	36
59	36
69	36
39	36
64	36
45	36
26	36
34	36
57	36
27	36
54	36
65	36
44	37
26	37
62	37
37	37
49	37
41	37
45	37
47	37
35	37
32	37
50	37
57	37
25	37
67	37
52	37
51	37
58	37
39	37
53	38
42	38
34	38
68	38
31	38
48	38
46	38
43	38
55	38
57	38
61	38
50	38
30	38
51	38
32	38
67	39
30	39
63	39
61	39
33	39
65	39
62	39
34	39
49	41
67	41
64	42
69	42
58	42
43	42
50	42
31	42
41	42
25	43
53	43
37	43
58	43
39	43
38	43
59	43
29	43
31	43
34	43
45	43
52	43
55	43
52	44
67	44
35	44
40	44
56	44
48	44
60	44
50	44
44	44
37	44
26	44
61	44
34	44
55	44
31	44
33	44
25	44
49	44
53	44
51	44
36	44
51	45
31	45
54	45
52	45
67	45
57	45
61	45
37	45
66	45
59	45
46	45
48	45
62	45
49	45
30	45
50	45
64	45
33	45
65	45
53	45
32	45
60	45
36	45
66	46
49	46
34	46
28	46
68	46
69	46
56	46
36	46
46	46
51	46
64	46
57	46
38	46
33	46
42	47
26	47
61	47
33	47
28	47
50	47
60	47
35	47
62	47
45	47
36	47
69	47
37	47
40	47
56	47
41	47
51	47
52	47
30	47
68	47
38	47
44	47
67	47
66	47
64	47
61	48
69	48
53	48
58	48
48	48
63	48
47	48
65	49
67	49
27	49
25	49
47	49
56	49
68	49
58	49
62	49
61	49
49	49
38	49
26	49
59	49
54	49
46	49
28	49
37	49
35	50
57	50
32	50
38	50
36	50
55	50
28	50
33	50
27	50
53	50
54	50
31	50
30	50
45	50
26	50
67	50
59	51
34	51
39	51
61	51
53	51
63	51
42	51
68	51
32	51
38	51
56	51
55	51
50	51
31	51
60	51
43	51
28	51
45	51
58	52
63	52
55	52
51	52
41	52
56	52
34	52
45	52
46	52
65	52
51	53
31	53
46	53
39	53
57	53
65	53
37	53
53	53
69	53
54	53
35	53
38	53
59	53
47	53
62	53
56	53
42	53
27	53
61	53
29	53
67	53
25	53
27	54
31	54
49	54
32	54
58	54
50	54
69	54
52	54
63	54
30	54
66	54
36	55
45	55
53	55
28	56
30	57
31	57
51	57
64	57
46	57
35	57
59	57
63	57
39	57
42	57
52	57
53	58
67	58
38	58
60	58
30	58
36	58
33	58
37	58
46	58
44	58
35	58
65	58
28	58
27	58
50	58
57	58
69	58
55	58
51	58
58	59
63	59
64	59
51	59
53	59
37	59
30	59
35	59
39	59
44	59
34	60
59	60
31	60
46	60
57	60
55	60
56	60
49	60
45	60
64	60
54	60
29	60
40	60
32	60
33	60
62	60
65	60
39	60
58	60
38	60
44	60
42	60
26	61
48	61
62	62
57	62
58	63
28	63
35	63
52	63
27	63
29	63
43	63
53	63
41	63
38	63
56	63
66	63
34	63
39	64
50	64
54	64
46	64
35	64
44	64
32	64
28	64
45	64
47	64
30	64
36	64
42	64
26	64
29	64
51	64
41	64
66	64
30	65
38	65
63	65
52	65
57	66
26	66
67	67
41	67
53	67
34	67
69	67
59	67
40	67
25	67
58	67
30	67
63	67
37	67
52	67
65	67
46	67
55	67
47	67
61	68
60	68
32	68
34	68
36	68
53	68
64	68
31	68
33	68
52	68
41	68
39	68
67	68
27	68
37	69
53	69
26	69
64	69
40	69
59	69
68	69
43	70
54	70
44	70
38	70
49	70
48	70
57	70
36	70
29	70
68	70
69	70
53	70
30	70
61	70
45	70
42	70
34	70
58	71
33	71
48	71
30	71
42	71
32	71
27	71
51	72
26	72
29	72
33	72
52	72
57	73
40	73
54	73
53	73
58	73
31	73
26	73
63	73
33	73
25	73
29	73
28	73
60	73
42	73
47	73
27	73
39	73
67	73
62	73
64	73
51	74
66	74
47	74
40	74
57	74
42	74
37	74
64	74
44	74
58	74
55	74
27	74
34	75
51	75
32	75
54	75
45	75
35	75
62	75
48	76
40	76
46	76
37	76
29	76
64	76
58	76
28	76
53	76
49	76
47	76
27	76
67	76
52	76
42	76
62	76
61	76
63	76
36	76
34	76
29	77
54	77
37	77
64	77
36	77
27	77
48	77
62	77
65	77
47	77
51	77
25	77
60	77
28	77
26	77
43	77
32	78
51	78
36	78
28	79
57	79
51	79
32	79
48	79
56	79
49	79
43	79
34	79
38	79
55	79
49	80
61	80
38	80
27	80
34	80
59	80
33	80
43	80
66	80
31	80
51	80
42	80
39	80
46	80
36	80
65	80
54	80
41	80
57	80
47	80
44	80
29	80
26	80
27	81
26	81
39	81
57	82
36	82
42	82
54	83
48	83
44	83
45	83
49	83
36	83
28	83
51	83
66	83
37	85
30	85
31	85
27	85
49	85
44	85
64	85
57	85
34	85
62	85
42	85
39	85
61	86
36	86
54	86
30	86
39	86
32	86
58	86
60	86
67	86
40	86
49	86
47	86
34	86
42	86
48	86
26	86
66	86
37	86
53	86
44	86
25	86
68	86
63	86
28	86
50	87
30	87
57	87
42	87
35	87
63	87
67	87
53	87
32	87
61	87
58	87
59	88
45	88
42	88
64	88
55	88
52	88
60	88
67	88
44	88
61	88
51	88
46	88
50	88
28	88
54	88
41	88
37	88
65	88
39	88
25	88
34	88
66	88
62	89
27	90
36	90
65	90
51	90
26	90
33	90
55	90
54	90
48	90
43	90
50	90
46	90
39	91
41	91
69	91
67	91
36	91
35	91
69	92
28	92
39	92
58	92
33	92
35	92
54	92
52	92
63	92
59	92
60	92
42	92
45	92
55	92
44	92
26	92
31	92
27	93
28	94
67	95
45	95
69	95
53	95
56	95
55	95
42	95
46	96
57	96
63	96
67	96
34	96
29	96
39	96
37	96
54	96
51	96
68	96
45	96
41	96
64	96
26	96
44	96
55	96
62	96
49	96
65	97
47	97
31	97
61	97
35	97
32	97
52	97
41	97
49	97
46	98
32	98
61	98
28	98
62	98
56	98
25	98
67	98
55	98
41	98
34	98
35	98
54	98
45	98
64	98
49	98
31	98
39	98
59	98
30	98
44	98
57	99
69	99
45	99
68	99
41	99
38	99
50	99
51	99
46	99
37	99
33	99
60	99
31	99
67	99
66	99
53	99
30	99
28	99
63	99
43	99
32	99
49	99
28	101
57	102
41	102
28	102
31	102
62	102
56	103
36	103
27	103
67	103
34	103
40	103
42	103
25	103
64	103
65	103
55	103
52	103
38	103
50	103
39	103
45	103
32	103
47	103
43	103
48	104
41	104
25	104
65	104
44	104
30	105
69	105
53	105
52	105
66	105
27	105
54	105
33	105
32	105
34	105
61	105
51	105
68	105
48	105
28	105
31	106
30	106
37	106
39	106
56	106
35	106
49	106
51	106
54	106
55	106
40	106
36	106
33	106
68	106
47	107
34	107
46	107
29	107
44	107
38	107
37	107
43	107
56	107
59	107
56	108
42	108
60	108
67	108
63	108
54	108
48	108
31	108
61	108
44	109
63	109
58	109
62	109
34	109
43	109
66	109
30	109
45	109
29	109
56	109
55	109
48	109
51	109
27	109
40	109
49	109
57	109
38	109
32	109
25	109
68	109
36	109
35	109
67	110
28	110
42	110
58	110
37	110
27	110
65	110
30	110
52	110
45	110
51	110
46	110
53	110
49	110
35	110
33	110
63	110
62	110
68	110
56	110
59	110
44	110
66	110
69	110
58	111
28	111
47	111
51	111
41	111
36	111
45	111
67	111
50	111
68	111
32	112
25	112
39	112
29	112
45	112
35	112
59	112
69	112
\.


--
-- Data for Name: notificaciones; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.notificaciones (id, usuario_id, actor_id, tipo, referencia_id, leida, fecha_registro) FROM stdin;
\.


--
-- Data for Name: publicacion_comentarios; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.publicacion_comentarios (id, publicacion_id, usuario_id, contenido, fecha_registro) FROM stdin;
1	1	32	¿Está en venta?	2026-08-22 15:12:26.669571
2	1	55	¡Brutal!	2026-08-22 15:12:26.669571
3	2	35	Quiero uno igual	2026-08-22 15:12:26.669571
4	2	29	Un clásico como pocos	2026-08-22 15:12:26.669571
5	3	54	Impresionante acabado	2026-08-22 15:12:26.669571
6	5	44	¡Qué pasada!	2026-08-22 15:12:26.669571
7	7	52	Menuda bestia 🔥	2026-08-22 15:12:26.669571
8	7	29	Un clásico como pocos	2026-08-22 15:12:26.669571
9	7	39	Menuda bestia 🔥	2026-08-22 15:12:26.669571
10	7	44	¿Está en venta?	2026-08-22 15:12:26.669571
11	8	56	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
12	8	36	Un clásico como pocos	2026-08-22 15:12:26.669571
13	8	33	Quiero uno igual	2026-08-22 15:12:26.669571
14	8	67	Un clásico como pocos	2026-08-22 15:12:26.669571
15	9	25	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
16	9	42	Menuda bestia 🔥	2026-08-22 15:12:26.669571
17	9	45	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
18	9	56	Se ve genial así	2026-08-22 15:12:26.669571
19	11	28	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
20	11	51	Se ve genial así	2026-08-22 15:12:26.669571
21	11	25	Un clásico como pocos	2026-08-22 15:12:26.669571
22	13	42	Se ve genial así	2026-08-22 15:12:26.669571
23	14	44	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
24	14	65	¿Está en venta?	2026-08-22 15:12:26.669571
25	15	37	Suena de maravilla seguro	2026-08-22 15:12:26.669571
26	15	49	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
27	15	32	Menuda bestia 🔥	2026-08-22 15:12:26.669571
28	15	30	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
29	16	49	¡Qué pasada!	2026-08-22 15:12:26.669571
30	16	47	Se ve genial así	2026-08-22 15:12:26.669571
31	16	39	Menuda bestia 🔥	2026-08-22 15:12:26.669571
32	17	47	¡Qué pasada!	2026-08-22 15:12:26.669571
33	17	43	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
34	18	29	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
35	18	38	Quiero uno igual	2026-08-22 15:12:26.669571
36	18	33	¡Qué pasada!	2026-08-22 15:12:26.669571
37	19	61	Impresionante acabado	2026-08-22 15:12:26.669571
38	19	44	¡Qué pasada!	2026-08-22 15:12:26.669571
39	19	36	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
40	19	25	Se ve genial así	2026-08-22 15:12:26.669571
41	22	48	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
42	22	40	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
43	22	52	Un clásico como pocos	2026-08-22 15:12:26.669571
44	23	25	Suena de maravilla seguro	2026-08-22 15:12:26.669571
45	24	51	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
46	24	40	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
47	24	33	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
48	25	52	¿Está en venta?	2026-08-22 15:12:26.669571
49	26	44	Un clásico como pocos	2026-08-22 15:12:26.669571
50	26	66	¡Qué pasada!	2026-08-22 15:12:26.669571
51	26	28	Un clásico como pocos	2026-08-22 15:12:26.669571
52	28	41	Un clásico como pocos	2026-08-22 15:12:26.669571
53	28	31	¡Qué pasada!	2026-08-22 15:12:26.669571
54	29	57	Me encanta el color	2026-08-22 15:12:26.669571
55	29	36	Suena de maravilla seguro	2026-08-22 15:12:26.669571
56	29	64	Me encanta el color	2026-08-22 15:12:26.669571
57	29	31	Menuda bestia 🔥	2026-08-22 15:12:26.669571
58	30	63	¡Qué pasada!	2026-08-22 15:12:26.669571
59	30	64	¿Está en venta?	2026-08-22 15:12:26.669571
60	31	34	¡Qué pasada!	2026-08-22 15:12:26.669571
61	31	51	Quiero uno igual	2026-08-22 15:12:26.669571
62	31	42	Impresionante acabado	2026-08-22 15:12:26.669571
63	31	59	Me encanta el color	2026-08-22 15:12:26.669571
64	32	52	Quiero uno igual	2026-08-22 15:12:26.669571
65	34	67	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
66	34	59	Suena de maravilla seguro	2026-08-22 15:12:26.669571
67	34	35	Un clásico como pocos	2026-08-22 15:12:26.669571
68	35	32	Quiero uno igual	2026-08-22 15:12:26.669571
69	37	56	Un clásico como pocos	2026-08-22 15:12:26.669571
70	37	50	Quiero uno igual	2026-08-22 15:12:26.669571
71	38	53	Impresionante acabado	2026-08-22 15:12:26.669571
72	39	34	¿Está en venta?	2026-08-22 15:12:26.669571
73	39	26	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
74	39	38	Un clásico como pocos	2026-08-22 15:12:26.669571
75	39	43	¡Qué pasada!	2026-08-22 15:12:26.669571
76	40	33	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
77	40	63	Quiero uno igual	2026-08-22 15:12:26.669571
78	40	43	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
79	40	65	Impresionante acabado	2026-08-22 15:12:26.669571
80	41	50	¡Brutal!	2026-08-22 15:12:26.669571
81	41	63	Quiero uno igual	2026-08-22 15:12:26.669571
82	42	46	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
83	43	52	¡Brutal!	2026-08-22 15:12:26.669571
84	43	48	¿Está en venta?	2026-08-22 15:12:26.669571
85	43	53	¿Está en venta?	2026-08-22 15:12:26.669571
86	43	43	Suena de maravilla seguro	2026-08-22 15:12:26.669571
87	44	49	Menuda bestia 🔥	2026-08-22 15:12:26.669571
88	46	26	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
89	46	69	¿Está en venta?	2026-08-22 15:12:26.669571
90	46	25	Un clásico como pocos	2026-08-22 15:12:26.669571
91	47	29	Se ve genial así	2026-08-22 15:12:26.669571
92	48	36	¿Está en venta?	2026-08-22 15:12:26.669571
93	48	50	Se ve genial así	2026-08-22 15:12:26.669571
94	48	59	¡Qué pasada!	2026-08-22 15:12:26.669571
95	50	26	Un clásico como pocos	2026-08-22 15:12:26.669571
96	50	68	Se ve genial así	2026-08-22 15:12:26.669571
97	52	60	Un clásico como pocos	2026-08-22 15:12:26.669571
98	52	50	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
99	52	34	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
100	52	69	¡Brutal!	2026-08-22 15:12:26.669571
101	53	65	Un clásico como pocos	2026-08-22 15:12:26.669571
102	53	32	¡Brutal!	2026-08-22 15:12:26.669571
103	54	44	Se ve genial así	2026-08-22 15:12:26.669571
104	54	28	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
105	54	69	Me encanta el color	2026-08-22 15:12:26.669571
106	55	58	¡Qué pasada!	2026-08-22 15:12:26.669571
107	55	50	Menuda bestia 🔥	2026-08-22 15:12:26.669571
108	56	68	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
109	56	53	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
110	56	52	Un clásico como pocos	2026-08-22 15:12:26.669571
111	56	46	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
112	57	25	Menuda bestia 🔥	2026-08-22 15:12:26.669571
113	57	64	Un clásico como pocos	2026-08-22 15:12:26.669571
114	57	67	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
115	58	38	Menuda bestia 🔥	2026-08-22 15:12:26.669571
116	59	47	Un clásico como pocos	2026-08-22 15:12:26.669571
117	59	32	Me encanta el color	2026-08-22 15:12:26.669571
118	59	41	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
119	59	52	Un clásico como pocos	2026-08-22 15:12:26.669571
120	60	46	Se ve genial así	2026-08-22 15:12:26.669571
121	60	27	Se ve genial así	2026-08-22 15:12:26.669571
122	60	65	¡Qué pasada!	2026-08-22 15:12:26.669571
123	61	65	Suena de maravilla seguro	2026-08-22 15:12:26.669571
124	61	57	Me encanta el color	2026-08-22 15:12:26.669571
125	61	29	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
126	61	56	Un clásico como pocos	2026-08-22 15:12:26.669571
127	62	33	Me encanta el color	2026-08-22 15:12:26.669571
128	62	38	Quiero uno igual	2026-08-22 15:12:26.669571
129	63	53	¡Brutal!	2026-08-22 15:12:26.669571
130	63	33	Se ve genial así	2026-08-22 15:12:26.669571
131	63	27	¡Brutal!	2026-08-22 15:12:26.669571
132	63	63	Suena de maravilla seguro	2026-08-22 15:12:26.669571
133	64	31	¡Qué pasada!	2026-08-22 15:12:26.669571
134	65	52	Un clásico como pocos	2026-08-22 15:12:26.669571
135	65	63	Suena de maravilla seguro	2026-08-22 15:12:26.669571
136	65	28	Suena de maravilla seguro	2026-08-22 15:12:26.669571
137	67	52	Menuda bestia 🔥	2026-08-22 15:12:26.669571
138	67	68	¿Está en venta?	2026-08-22 15:12:26.669571
139	68	67	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
140	68	42	¡Brutal!	2026-08-22 15:12:26.669571
141	69	49	¡Brutal!	2026-08-22 15:12:26.669571
142	70	50	¿Está en venta?	2026-08-22 15:12:26.669571
143	71	66	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
144	71	69	¡Brutal!	2026-08-22 15:12:26.669571
145	71	39	Un clásico como pocos	2026-08-22 15:12:26.669571
146	71	48	Enhorabuena por el trabajo	2026-08-22 15:12:26.669571
147	72	64	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
148	72	55	¡Brutal!	2026-08-22 15:12:26.669571
149	72	52	¡Brutal!	2026-08-22 15:12:26.669571
150	72	29	Se ve genial así	2026-08-22 15:12:26.669571
151	73	64	Se ve genial así	2026-08-22 15:12:26.669571
152	74	45	¡Brutal!	2026-08-22 15:12:26.669571
153	74	67	Menuda bestia 🔥	2026-08-22 15:12:26.669571
154	74	43	Se ve genial así	2026-08-22 15:12:26.669571
155	74	32	Quiero uno igual	2026-08-22 15:12:26.669571
156	75	39	¿Cuántos caballos tiene?	2026-08-22 15:12:26.669571
\.


--
-- Data for Name: publicacion_likes; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.publicacion_likes (usuario_id, publicacion_id) FROM stdin;
36	1
59	1
26	1
44	1
50	1
39	1
68	1
30	1
54	1
67	1
64	1
32	1
56	1
58	1
52	1
41	1
66	1
27	1
43	1
35	1
43	2
35	2
49	2
36	2
45	2
29	2
38	2
54	2
64	2
61	2
51	2
37	2
41	2
34	2
44	2
62	2
63	2
69	2
57	2
33	2
58	3
28	3
62	3
51	3
28	4
60	4
41	4
35	4
43	4
48	4
42	4
69	4
67	4
57	4
68	4
40	4
30	4
44	4
32	4
36	4
63	5
60	5
64	6
53	6
27	6
55	6
62	6
66	6
67	6
49	7
66	7
26	7
52	8
56	8
66	8
25	8
49	8
60	8
34	8
63	8
57	8
31	8
50	8
48	8
33	8
64	8
55	8
44	9
28	9
68	9
27	9
40	9
35	9
63	9
61	9
69	9
32	9
41	9
37	9
66	10
42	10
49	10
37	10
69	10
51	10
43	10
33	10
54	10
28	10
31	10
48	10
35	10
67	10
39	10
60	10
64	10
65	10
26	10
27	10
51	11
59	11
45	11
66	11
26	11
41	12
51	12
50	12
56	12
64	12
65	12
54	12
69	12
26	14
44	14
37	14
34	14
52	14
43	14
59	14
60	14
50	14
57	14
41	14
56	14
45	14
39	14
62	14
25	14
65	14
61	15
54	15
43	16
46	16
35	16
68	16
25	17
63	17
33	17
53	17
57	18
43	19
50	19
56	19
66	19
30	19
67	19
31	19
37	19
59	19
58	20
54	20
41	20
25	20
26	20
42	20
65	20
28	20
34	20
27	20
29	20
59	20
38	20
66	21
27	21
69	21
44	21
45	21
64	21
34	21
53	21
26	21
61	21
63	21
57	21
46	21
47	21
48	21
58	21
29	21
56	21
35	21
32	21
66	22
56	22
65	22
29	22
30	22
27	22
63	22
31	22
42	23
56	23
58	23
35	23
28	23
67	23
69	23
66	23
50	23
39	23
61	23
50	24
62	24
43	25
65	25
44	25
66	25
28	25
30	25
29	25
52	25
48	25
55	25
33	25
58	25
60	25
41	25
31	25
26	25
47	25
50	25
51	25
54	25
64	26
36	26
61	26
38	26
49	26
53	26
60	26
28	26
42	27
36	27
52	27
37	27
53	28
43	28
57	28
62	28
30	28
44	28
27	28
61	29
26	29
54	29
49	29
52	29
30	29
68	29
51	29
53	29
33	29
43	29
28	29
48	29
37	29
65	30
56	30
48	30
42	30
62	30
35	30
31	30
55	30
67	30
64	30
60	30
63	30
27	30
66	30
58	30
36	30
45	31
58	31
33	31
65	31
49	31
51	31
63	31
43	31
68	31
60	31
53	31
35	31
36	31
52	31
62	31
38	31
60	32
26	32
49	32
36	32
57	32
43	32
48	33
54	33
41	33
26	33
51	34
48	34
52	34
63	34
27	34
43	34
41	35
28	35
26	35
37	35
35	35
55	35
45	35
62	35
63	36
68	37
37	37
33	37
38	37
46	37
30	37
58	38
48	38
27	38
64	39
54	39
58	39
65	39
55	39
47	39
69	39
40	40
37	40
52	40
31	40
38	40
46	40
57	40
45	40
33	40
66	40
35	40
53	40
59	40
36	41
58	41
41	41
39	42
31	42
47	42
69	42
32	42
50	42
29	42
36	43
35	43
56	43
40	43
59	43
32	43
58	43
26	43
55	44
34	44
54	44
49	44
38	44
32	44
31	44
30	44
61	44
44	44
57	44
28	44
56	44
59	44
51	44
63	44
35	44
46	45
50	45
65	45
33	45
62	45
51	45
28	45
31	45
59	45
68	45
67	45
52	45
53	45
45	46
49	46
51	46
39	46
40	46
68	46
30	46
62	46
31	46
48	46
47	46
59	46
34	46
60	46
53	46
61	46
37	46
56	47
62	47
68	47
57	47
53	47
63	47
29	47
49	47
65	47
38	47
52	47
42	47
69	47
26	47
31	47
27	47
58	47
39	47
43	48
63	48
69	48
47	48
41	48
30	48
35	48
55	48
49	48
60	48
50	48
39	48
56	48
42	48
25	48
36	48
66	48
29	48
53	48
61	50
68	51
48	51
36	51
49	51
35	51
28	51
54	51
58	52
68	52
65	52
42	52
45	52
62	52
32	53
66	53
28	53
34	53
42	53
60	53
61	53
49	53
51	53
44	54
38	54
59	54
64	54
68	54
36	54
69	54
34	54
56	54
51	54
31	54
61	54
31	55
60	55
57	55
59	55
44	55
66	55
49	55
26	55
35	55
55	55
39	55
38	55
47	55
53	55
36	55
32	56
39	56
33	56
37	56
49	56
66	56
68	56
53	56
34	56
41	56
61	56
30	56
43	56
54	56
36	56
46	56
62	56
69	57
54	57
65	57
39	57
26	57
68	57
47	57
46	57
29	57
25	57
37	57
52	57
41	57
60	57
33	57
67	58
61	58
41	58
51	58
52	58
49	58
69	58
28	58
45	58
47	58
58	58
37	58
50	58
60	59
52	59
28	59
49	59
63	59
38	59
56	59
51	59
67	59
65	59
42	59
27	59
31	59
31	60
42	60
54	60
62	60
36	60
52	60
68	60
41	60
34	60
59	61
42	62
57	62
69	62
25	62
33	62
27	62
52	62
61	62
37	62
34	62
65	62
55	62
59	62
41	62
58	62
31	62
66	62
56	62
29	63
60	63
27	63
50	63
44	63
63	63
28	63
35	63
32	63
61	63
54	63
37	63
65	63
58	64
45	64
66	65
33	65
69	65
29	65
47	65
48	65
52	66
57	67
45	67
54	67
37	68
45	68
46	68
27	68
52	68
69	68
35	68
40	68
33	68
67	68
50	68
64	68
31	68
28	68
58	68
62	68
63	69
25	69
38	69
57	69
44	69
56	69
46	69
52	70
41	70
27	70
55	70
30	70
42	70
56	70
36	70
57	70
35	70
50	71
64	71
39	72
43	72
25	72
26	72
41	72
32	72
56	72
53	72
60	72
66	72
34	72
63	72
47	72
47	73
44	73
65	73
68	73
50	73
58	73
66	74
30	74
45	74
34	74
35	74
54	74
43	74
33	74
27	74
51	74
49	74
37	74
40	74
39	74
59	74
25	74
44	74
53	75
49	75
61	75
58	75
37	75
\.


--
-- Data for Name: publicaciones; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.publicaciones (id, usuario_id, coche_id, texto, imagen_url, fecha_registro) FROM stdin;
1	25	\N	No hay nada como el sonido de este motor arrancando en frío.	https://loremflickr.com/800/600/car/all?lock=143	2026-08-22 15:12:26.500835
2	25	\N	Nueva incorporación al garaje, ya os cuento más.	\N	2026-08-22 15:12:26.500835
3	25	17	Últimos retoques antes de la ITV.	https://loremflickr.com/800/600/car/all?lock=144	2026-08-22 15:12:26.500835
4	27	21	No hay nada como el sonido de este motor arrancando en frío.	https://loremflickr.com/800/600/car/all?lock=145	2026-08-22 15:12:26.500835
5	27	\N	Un año más con él, y no me cansa.	https://loremflickr.com/800/600/car/all?lock=146	2026-08-22 15:12:26.500835
6	27	21	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=147	2026-08-22 15:12:26.500835
7	29	24	No hay nada como el sonido de este motor arrancando en frío.	https://loremflickr.com/800/600/car/all?lock=148	2026-08-22 15:12:26.500835
8	30	\N	Un año más con él, y no me cansa.	https://loremflickr.com/800/600/car/all?lock=149	2026-08-22 15:12:26.500835
9	30	29	Repasando la mecánica antes del viaje largo del mes que viene.	https://loremflickr.com/800/600/car/all?lock=150	2026-08-22 15:12:26.500835
10	30	27	Café + coches, la combinación perfecta de sábado por la mañana.	\N	2026-08-22 15:12:26.500835
11	31	\N	Cambié las llantas y quedó otro coche completamente distinto.	https://loremflickr.com/800/600/car/all?lock=151	2026-08-22 15:12:26.500835
12	32	34	Domingo de carretera con este compañero de viaje 🏁	https://loremflickr.com/800/600/car/all?lock=152	2026-08-22 15:12:26.500835
13	32	\N	Cambié las llantas y quedó otro coche completamente distinto.	https://loremflickr.com/800/600/car/all?lock=153	2026-08-22 15:12:26.500835
14	33	\N	Recién salido del taller, como nuevo.	\N	2026-08-22 15:12:26.500835
15	33	\N	Ruta de montaña este finde, fotos random.	https://loremflickr.com/800/600/car/all?lock=154	2026-08-22 15:12:26.500835
16	34	39	Pequeña puesta a punto para la temporada que viene.	https://loremflickr.com/800/600/car/all?lock=155	2026-08-22 15:12:26.500835
17	34	\N	Ruta de montaña este finde, fotos random.	\N	2026-08-22 15:12:26.500835
18	35	\N	Últimos retoques antes de la ITV.	https://loremflickr.com/800/600/car/all?lock=156	2026-08-22 15:12:26.500835
19	35	40	Pequeña puesta a punto para la temporada que viene.	https://loremflickr.com/800/600/car/all?lock=157	2026-08-22 15:12:26.500835
20	36	\N	Pequeña puesta a punto para la temporada que viene.	https://loremflickr.com/800/600/car/all?lock=158	2026-08-22 15:12:26.500835
21	38	48	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=159	2026-08-22 15:12:26.500835
22	40	52	Ruta de montaña este finde, fotos random.	https://loremflickr.com/800/600/car/all?lock=160	2026-08-22 15:12:26.500835
23	40	53	Recién salido del taller, como nuevo.	https://loremflickr.com/800/600/car/all?lock=161	2026-08-22 15:12:26.500835
24	41	\N	Últimos retoques antes de la ITV.	https://loremflickr.com/800/600/car/all?lock=162	2026-08-22 15:12:26.500835
25	41	54	Café + coches, la combinación perfecta de sábado por la mañana.	https://loremflickr.com/800/600/car/all?lock=163	2026-08-22 15:12:26.500835
26	42	\N	Pulido de la mañana antes de la quedada de hoy.	\N	2026-08-22 15:12:26.500835
27	42	\N	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=164	2026-08-22 15:12:26.500835
28	42	57	Un año más con él, y no me cansa.	https://loremflickr.com/800/600/car/all?lock=165	2026-08-22 15:12:26.500835
29	43	58	Repasando la mecánica antes del viaje largo del mes que viene.	https://loremflickr.com/800/600/car/all?lock=166	2026-08-22 15:12:26.500835
30	43	58	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=167	2026-08-22 15:12:26.500835
31	43	\N	Nueva incorporación al garaje, ya os cuento más.	https://loremflickr.com/800/600/car/all?lock=168	2026-08-22 15:12:26.500835
32	44	\N	Últimos retoques antes de la ITV.	https://loremflickr.com/800/600/car/all?lock=169	2026-08-22 15:12:26.500835
33	45	\N	Café + coches, la combinación perfecta de sábado por la mañana.	https://loremflickr.com/800/600/car/all?lock=170	2026-08-22 15:12:26.500835
34	46	64	Nueva incorporación al garaje, ya os cuento más.	https://loremflickr.com/800/600/car/all?lock=171	2026-08-22 15:12:26.500835
35	47	66	Nueva incorporación al garaje, ya os cuento más.	https://loremflickr.com/800/600/car/all?lock=172	2026-08-22 15:12:26.500835
36	47	65	Domingo de carretera con este compañero de viaje 🏁	\N	2026-08-22 15:12:26.500835
37	47	65	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=173	2026-08-22 15:12:26.500835
38	49	69	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=174	2026-08-22 15:12:26.500835
39	50	\N	Café + coches, la combinación perfecta de sábado por la mañana.	https://loremflickr.com/800/600/car/all?lock=175	2026-08-22 15:12:26.500835
40	51	73	Pequeña puesta a punto para la temporada que viene.	\N	2026-08-22 15:12:26.500835
41	51	72	Un año más con él, y no me cansa.	https://loremflickr.com/800/600/car/all?lock=176	2026-08-22 15:12:26.500835
42	51	72	Nueva incorporación al garaje, ya os cuento más.	https://loremflickr.com/800/600/car/all?lock=177	2026-08-22 15:12:26.500835
43	52	74	Un año más con él, y no me cansa.	\N	2026-08-22 15:12:26.500835
44	54	80	Nueva incorporación al garaje, ya os cuento más.	\N	2026-08-22 15:12:26.500835
45	55	\N	No hay nada como el sonido de este motor arrancando en frío.	https://loremflickr.com/800/600/car/all?lock=178	2026-08-22 15:12:26.500835
46	56	85	Pulido de la mañana antes de la quedada de hoy.	https://loremflickr.com/800/600/car/all?lock=179	2026-08-22 15:12:26.500835
47	56	\N	Pulido de la mañana antes de la quedada de hoy.	\N	2026-08-22 15:12:26.500835
48	56	84	Pulido de la mañana antes de la quedada de hoy.	https://loremflickr.com/800/600/car/all?lock=180	2026-08-22 15:12:26.500835
49	57	\N	Pequeña puesta a punto para la temporada que viene.	\N	2026-08-22 15:12:26.500835
50	57	\N	Cambié las llantas y quedó otro coche completamente distinto.	\N	2026-08-22 15:12:26.500835
51	57	87	¿Alguien más para la quedada del sábado?	\N	2026-08-22 15:12:26.500835
52	58	91	Repasando la mecánica antes del viaje largo del mes que viene.	https://loremflickr.com/800/600/car/all?lock=181	2026-08-22 15:12:26.500835
53	59	\N	Cambié las llantas y quedó otro coche completamente distinto.	\N	2026-08-22 15:12:26.500835
54	59	\N	Encontré este cartel vintage a juego con el coche, no pude resistirme.	https://loremflickr.com/800/600/car/all?lock=182	2026-08-22 15:12:26.500835
55	59	93	Cambié las llantas y quedó otro coche completamente distinto.	\N	2026-08-22 15:12:26.500835
56	60	\N	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=183	2026-08-22 15:12:26.500835
57	60	96	Recién salido del taller, como nuevo.	\N	2026-08-22 15:12:26.500835
58	60	\N	Un año más con él, y no me cansa.	https://loremflickr.com/800/600/car/all?lock=184	2026-08-22 15:12:26.500835
59	61	98	Nueva incorporación al garaje, ya os cuento más.	https://loremflickr.com/800/600/car/all?lock=185	2026-08-22 15:12:26.500835
60	61	\N	Domingo de carretera con este compañero de viaje 🏁	https://loremflickr.com/800/600/car/all?lock=186	2026-08-22 15:12:26.500835
61	61	97	Ruta de montaña este finde, fotos random.	https://loremflickr.com/800/600/car/all?lock=187	2026-08-22 15:12:26.500835
62	63	100	Nueva incorporación al garaje, ya os cuento más.	\N	2026-08-22 15:12:26.500835
63	64	101	Café + coches, la combinación perfecta de sábado por la mañana.	https://loremflickr.com/800/600/car/all?lock=188	2026-08-22 15:12:26.500835
64	64	101	Pequeña puesta a punto para la temporada que viene.	\N	2026-08-22 15:12:26.500835
65	65	\N	Pulido de la mañana antes de la quedada de hoy.	\N	2026-08-22 15:12:26.500835
66	65	\N	Un año más con él, y no me cansa.	https://loremflickr.com/800/600/car/all?lock=189	2026-08-22 15:12:26.500835
67	65	\N	Ruta de montaña este finde, fotos random.	\N	2026-08-22 15:12:26.500835
68	66	105	¿Alguien más para la quedada del sábado?	https://loremflickr.com/800/600/car/all?lock=190	2026-08-22 15:12:26.500835
69	66	107	Domingo de carretera con este compañero de viaje 🏁	https://loremflickr.com/800/600/car/all?lock=191	2026-08-22 15:12:26.500835
70	66	\N	Pequeña puesta a punto para la temporada que viene.	\N	2026-08-22 15:12:26.500835
71	67	\N	Pequeña puesta a punto para la temporada que viene.	https://loremflickr.com/800/600/car/all?lock=192	2026-08-22 15:12:26.500835
72	68	110	Últimos retoques antes de la ITV.	\N	2026-08-22 15:12:26.500835
73	69	112	No hay nada como el sonido de este motor arrancando en frío.	https://loremflickr.com/800/600/car/all?lock=193	2026-08-22 15:12:26.500835
74	69	112	Repasando la mecánica antes del viaje largo del mes que viene.	https://loremflickr.com/800/600/car/all?lock=194	2026-08-22 15:12:26.500835
75	69	\N	Encontré este cartel vintage a juego con el coche, no pude resistirme.	\N	2026-08-22 15:12:26.500835
\.


--
-- Data for Name: seguidores; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.seguidores (seguidor_id, seguido_id, creado_en) FROM stdin;
22	24	2026-08-19 11:47:22.433813
25	27	2026-08-22 15:12:26.527375
25	36	2026-08-22 15:12:26.527375
25	64	2026-08-22 15:12:26.527375
25	31	2026-08-22 15:12:26.527375
25	34	2026-08-22 15:12:26.527375
25	52	2026-08-22 15:12:26.527375
25	49	2026-08-22 15:12:26.527375
25	41	2026-08-22 15:12:26.527375
25	33	2026-08-22 15:12:26.527375
26	69	2026-08-22 15:12:26.527375
26	43	2026-08-22 15:12:26.527375
26	38	2026-08-22 15:12:26.527375
26	55	2026-08-22 15:12:26.527375
26	41	2026-08-22 15:12:26.527375
27	34	2026-08-22 15:12:26.527375
27	69	2026-08-22 15:12:26.527375
27	46	2026-08-22 15:12:26.527375
27	49	2026-08-22 15:12:26.527375
27	59	2026-08-22 15:12:26.527375
27	41	2026-08-22 15:12:26.527375
28	39	2026-08-22 15:12:26.527375
28	33	2026-08-22 15:12:26.527375
28	69	2026-08-22 15:12:26.527375
28	66	2026-08-22 15:12:26.527375
28	43	2026-08-22 15:12:26.527375
28	31	2026-08-22 15:12:26.527375
28	67	2026-08-22 15:12:26.527375
28	34	2026-08-22 15:12:26.527375
28	58	2026-08-22 15:12:26.527375
28	46	2026-08-22 15:12:26.527375
29	51	2026-08-22 15:12:26.527375
29	37	2026-08-22 15:12:26.527375
29	57	2026-08-22 15:12:26.527375
29	68	2026-08-22 15:12:26.527375
29	69	2026-08-22 15:12:26.527375
30	43	2026-08-22 15:12:26.527375
30	36	2026-08-22 15:12:26.527375
30	55	2026-08-22 15:12:26.527375
30	57	2026-08-22 15:12:26.527375
30	44	2026-08-22 15:12:26.527375
31	29	2026-08-22 15:12:26.527375
31	51	2026-08-22 15:12:26.527375
31	44	2026-08-22 15:12:26.527375
31	64	2026-08-22 15:12:26.527375
31	49	2026-08-22 15:12:26.527375
31	27	2026-08-22 15:12:26.527375
32	29	2026-08-22 15:12:26.527375
32	66	2026-08-22 15:12:26.527375
32	38	2026-08-22 15:12:26.527375
33	69	2026-08-22 15:12:26.527375
33	47	2026-08-22 15:12:26.527375
33	63	2026-08-22 15:12:26.527375
33	62	2026-08-22 15:12:26.527375
33	40	2026-08-22 15:12:26.527375
33	35	2026-08-22 15:12:26.527375
33	57	2026-08-22 15:12:26.527375
33	68	2026-08-22 15:12:26.527375
34	55	2026-08-22 15:12:26.527375
34	48	2026-08-22 15:12:26.527375
34	59	2026-08-22 15:12:26.527375
34	50	2026-08-22 15:12:26.527375
34	47	2026-08-22 15:12:26.527375
34	63	2026-08-22 15:12:26.527375
34	46	2026-08-22 15:12:26.527375
34	42	2026-08-22 15:12:26.527375
34	60	2026-08-22 15:12:26.527375
35	64	2026-08-22 15:12:26.527375
35	42	2026-08-22 15:12:26.527375
35	32	2026-08-22 15:12:26.527375
36	59	2026-08-22 15:12:26.527375
36	49	2026-08-22 15:12:26.527375
36	33	2026-08-22 15:12:26.527375
37	59	2026-08-22 15:12:26.527375
37	52	2026-08-22 15:12:26.527375
37	25	2026-08-22 15:12:26.527375
37	45	2026-08-22 15:12:26.527375
38	54	2026-08-22 15:12:26.527375
38	42	2026-08-22 15:12:26.527375
38	36	2026-08-22 15:12:26.527375
38	44	2026-08-22 15:12:26.527375
38	68	2026-08-22 15:12:26.527375
38	39	2026-08-22 15:12:26.527375
38	32	2026-08-22 15:12:26.527375
38	48	2026-08-22 15:12:26.527375
39	62	2026-08-22 15:12:26.527375
39	29	2026-08-22 15:12:26.527375
39	41	2026-08-22 15:12:26.527375
39	65	2026-08-22 15:12:26.527375
40	56	2026-08-22 15:12:26.527375
40	48	2026-08-22 15:12:26.527375
40	46	2026-08-22 15:12:26.527375
40	42	2026-08-22 15:12:26.527375
40	41	2026-08-22 15:12:26.527375
41	44	2026-08-22 15:12:26.527375
41	55	2026-08-22 15:12:26.527375
41	42	2026-08-22 15:12:26.527375
41	46	2026-08-22 15:12:26.527375
41	31	2026-08-22 15:12:26.527375
41	69	2026-08-22 15:12:26.527375
41	37	2026-08-22 15:12:26.527375
41	36	2026-08-22 15:12:26.527375
42	25	2026-08-22 15:12:26.527375
42	48	2026-08-22 15:12:26.527375
42	49	2026-08-22 15:12:26.527375
42	52	2026-08-22 15:12:26.527375
42	53	2026-08-22 15:12:26.527375
42	31	2026-08-22 15:12:26.527375
42	33	2026-08-22 15:12:26.527375
42	45	2026-08-22 15:12:26.527375
42	46	2026-08-22 15:12:26.527375
42	30	2026-08-22 15:12:26.527375
43	37	2026-08-22 15:12:26.527375
43	45	2026-08-22 15:12:26.527375
43	38	2026-08-22 15:12:26.527375
43	63	2026-08-22 15:12:26.527375
44	48	2026-08-22 15:12:26.527375
44	29	2026-08-22 15:12:26.527375
44	42	2026-08-22 15:12:26.527375
44	62	2026-08-22 15:12:26.527375
44	43	2026-08-22 15:12:26.527375
45	49	2026-08-22 15:12:26.527375
45	27	2026-08-22 15:12:26.527375
45	34	2026-08-22 15:12:26.527375
45	69	2026-08-22 15:12:26.527375
45	43	2026-08-22 15:12:26.527375
45	67	2026-08-22 15:12:26.527375
46	57	2026-08-22 15:12:26.527375
46	25	2026-08-22 15:12:26.527375
46	37	2026-08-22 15:12:26.527375
46	38	2026-08-22 15:12:26.527375
46	54	2026-08-22 15:12:26.527375
47	38	2026-08-22 15:12:26.527375
47	69	2026-08-22 15:12:26.527375
47	34	2026-08-22 15:12:26.527375
48	28	2026-08-22 15:12:26.527375
48	55	2026-08-22 15:12:26.527375
48	62	2026-08-22 15:12:26.527375
48	44	2026-08-22 15:12:26.527375
48	36	2026-08-22 15:12:26.527375
48	40	2026-08-22 15:12:26.527375
49	35	2026-08-22 15:12:26.527375
49	55	2026-08-22 15:12:26.527375
49	56	2026-08-22 15:12:26.527375
49	34	2026-08-22 15:12:26.527375
49	57	2026-08-22 15:12:26.527375
49	32	2026-08-22 15:12:26.527375
49	68	2026-08-22 15:12:26.527375
49	39	2026-08-22 15:12:26.527375
49	67	2026-08-22 15:12:26.527375
50	63	2026-08-22 15:12:26.527375
50	42	2026-08-22 15:12:26.527375
50	55	2026-08-22 15:12:26.527375
51	68	2026-08-22 15:12:26.527375
51	40	2026-08-22 15:12:26.527375
51	31	2026-08-22 15:12:26.527375
51	43	2026-08-22 15:12:26.527375
51	56	2026-08-22 15:12:26.527375
51	44	2026-08-22 15:12:26.527375
52	39	2026-08-22 15:12:26.527375
52	36	2026-08-22 15:12:26.527375
52	29	2026-08-22 15:12:26.527375
52	37	2026-08-22 15:12:26.527375
52	62	2026-08-22 15:12:26.527375
52	25	2026-08-22 15:12:26.527375
52	53	2026-08-22 15:12:26.527375
52	49	2026-08-22 15:12:26.527375
53	31	2026-08-22 15:12:26.527375
53	29	2026-08-22 15:12:26.527375
53	52	2026-08-22 15:12:26.527375
53	50	2026-08-22 15:12:26.527375
53	54	2026-08-22 15:12:26.527375
54	63	2026-08-22 15:12:26.527375
54	49	2026-08-22 15:12:26.527375
54	40	2026-08-22 15:12:26.527375
54	29	2026-08-22 15:12:26.527375
55	69	2026-08-22 15:12:26.527375
55	35	2026-08-22 15:12:26.527375
55	43	2026-08-22 15:12:26.527375
56	27	2026-08-22 15:12:26.527375
56	48	2026-08-22 15:12:26.527375
56	46	2026-08-22 15:12:26.527375
56	35	2026-08-22 15:12:26.527375
56	61	2026-08-22 15:12:26.527375
56	57	2026-08-22 15:12:26.527375
56	25	2026-08-22 15:12:26.527375
56	63	2026-08-22 15:12:26.527375
56	41	2026-08-22 15:12:26.527375
56	34	2026-08-22 15:12:26.527375
57	46	2026-08-22 15:12:26.527375
57	50	2026-08-22 15:12:26.527375
57	38	2026-08-22 15:12:26.527375
57	40	2026-08-22 15:12:26.527375
57	42	2026-08-22 15:12:26.527375
57	63	2026-08-22 15:12:26.527375
57	44	2026-08-22 15:12:26.527375
57	53	2026-08-22 15:12:26.527375
57	47	2026-08-22 15:12:26.527375
58	43	2026-08-22 15:12:26.527375
58	40	2026-08-22 15:12:26.527375
58	69	2026-08-22 15:12:26.527375
58	46	2026-08-22 15:12:26.527375
58	29	2026-08-22 15:12:26.527375
58	26	2026-08-22 15:12:26.527375
58	38	2026-08-22 15:12:26.527375
58	33	2026-08-22 15:12:26.527375
58	50	2026-08-22 15:12:26.527375
58	54	2026-08-22 15:12:26.527375
59	56	2026-08-22 15:12:26.527375
59	51	2026-08-22 15:12:26.527375
59	26	2026-08-22 15:12:26.527375
60	41	2026-08-22 15:12:26.527375
60	45	2026-08-22 15:12:26.527375
60	52	2026-08-22 15:12:26.527375
60	33	2026-08-22 15:12:26.527375
60	27	2026-08-22 15:12:26.527375
60	40	2026-08-22 15:12:26.527375
60	29	2026-08-22 15:12:26.527375
60	43	2026-08-22 15:12:26.527375
60	31	2026-08-22 15:12:26.527375
60	65	2026-08-22 15:12:26.527375
61	54	2026-08-22 15:12:26.527375
61	33	2026-08-22 15:12:26.527375
61	62	2026-08-22 15:12:26.527375
61	42	2026-08-22 15:12:26.527375
62	37	2026-08-22 15:12:26.527375
62	60	2026-08-22 15:12:26.527375
62	63	2026-08-22 15:12:26.527375
62	31	2026-08-22 15:12:26.527375
62	42	2026-08-22 15:12:26.527375
63	66	2026-08-22 15:12:26.527375
63	40	2026-08-22 15:12:26.527375
63	67	2026-08-22 15:12:26.527375
63	29	2026-08-22 15:12:26.527375
63	33	2026-08-22 15:12:26.527375
63	35	2026-08-22 15:12:26.527375
63	65	2026-08-22 15:12:26.527375
63	53	2026-08-22 15:12:26.527375
63	62	2026-08-22 15:12:26.527375
63	64	2026-08-22 15:12:26.527375
64	41	2026-08-22 15:12:26.527375
64	53	2026-08-22 15:12:26.527375
64	38	2026-08-22 15:12:26.527375
64	69	2026-08-22 15:12:26.527375
64	59	2026-08-22 15:12:26.527375
64	30	2026-08-22 15:12:26.527375
64	67	2026-08-22 15:12:26.527375
64	39	2026-08-22 15:12:26.527375
64	47	2026-08-22 15:12:26.527375
65	39	2026-08-22 15:12:26.527375
65	68	2026-08-22 15:12:26.527375
65	41	2026-08-22 15:12:26.527375
65	29	2026-08-22 15:12:26.527375
65	30	2026-08-22 15:12:26.527375
65	43	2026-08-22 15:12:26.527375
65	32	2026-08-22 15:12:26.527375
65	37	2026-08-22 15:12:26.527375
65	51	2026-08-22 15:12:26.527375
66	57	2026-08-22 15:12:26.527375
66	47	2026-08-22 15:12:26.527375
66	56	2026-08-22 15:12:26.527375
66	68	2026-08-22 15:12:26.527375
67	68	2026-08-22 15:12:26.527375
67	43	2026-08-22 15:12:26.527375
67	28	2026-08-22 15:12:26.527375
68	30	2026-08-22 15:12:26.527375
68	52	2026-08-22 15:12:26.527375
68	41	2026-08-22 15:12:26.527375
68	36	2026-08-22 15:12:26.527375
68	50	2026-08-22 15:12:26.527375
68	43	2026-08-22 15:12:26.527375
68	53	2026-08-22 15:12:26.527375
68	48	2026-08-22 15:12:26.527375
68	60	2026-08-22 15:12:26.527375
68	62	2026-08-22 15:12:26.527375
69	40	2026-08-22 15:12:26.527375
69	62	2026-08-22 15:12:26.527375
69	51	2026-08-22 15:12:26.527375
69	33	2026-08-22 15:12:26.527375
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.usuarios (id, nombre, email, password, fecha_registro, bio, avatar_url) FROM stdin;
23	Demo_Clasicos	demo2@motorsocial.local	$2b$10$vCSVS6lWN5farFZ7ujM95eHg9PN9czg7D8ZqUt6Elen82USvDY9Ni	2026-08-16 20:18:42.929281	\N	\N
24	Demo_JDM	demo3@motorsocial.local	$2b$10$LzqfxdGKIGs30ERHAtdUZezy/D2zdrLcz8UJ.LiKhOoVQsEVAIj9G	2026-08-16 20:18:42.989386	\N	\N
22	Demo_Rally	demo1@motorsocial.local	$2b$10$TjYfCYU0Tg2gGIbBZ9wQ/uU3aS1w89TEF7e7VkSWAMEjAaKIypSaC	2026-08-16 20:18:42.861151	\N	\N
25	Adrian_Rally	adrian_rally@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Track days y café.	https://loremflickr.com/800/600/portrait,person/all?lock=1
26	Manuel_Wheels	manuel_wheels@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=2
27	Carlos_Drift	carlos_drift@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=3
28	Manuel_Track	manuel_track@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=4
29	Adrian_Garage	adrian_garage@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=5
30	Carlos_Circuit	carlos_circuit@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=6
31	Diego_Garage	diego_garage@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Restaurando clásicos en mi tiempo libre.	https://loremflickr.com/800/600/portrait,person/all?lock=7
32	Lucia_Racing	lucia_racing@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=8
33	Marc_JDM	marc_jdm@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Restaurando clásicos en mi tiempo libre.	https://loremflickr.com/800/600/portrait,person/all?lock=9
34	Marc_Speed	marc_speed@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Si suena bien, va bien.	https://loremflickr.com/800/600/portrait,person/all?lock=10
35	Hugo_Wheels	hugo_wheels@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=11
36	Claudia_GT	claudia_gt@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Track days y café.	https://loremflickr.com/800/600/portrait,person/all?lock=12
37	Paula_Circuit	paula_circuit@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=13
38	Ines_Offroad	ines_offroad@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Coleccionista de kilómetros y anécdotas.	https://loremflickr.com/800/600/portrait,person/all?lock=14
39	Paula_Motor	paula_motor@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=15
40	Javier_Drift	javier_drift@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Restaurando clásicos en mi tiempo libre.	https://loremflickr.com/800/600/portrait,person/all?lock=16
41	Ines_Tuning	ines_tuning@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Coleccionista de kilómetros y anécdotas.	https://loremflickr.com/800/600/portrait,person/all?lock=17
42	Dani_Garage	dani_garage@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Coleccionista de kilómetros y anécdotas.	https://loremflickr.com/800/600/portrait,person/all?lock=18
43	Hugo_Circuit	hugo_circuit@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Los fines de semana son para la carretera.	https://loremflickr.com/800/600/portrait,person/all?lock=19
44	Diego_Circuit	diego_circuit@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Garaje siempre abierto.	https://loremflickr.com/800/600/portrait,person/all?lock=20
45	Claudia_Classic	claudia_classic@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Los fines de semana son para la carretera.	https://loremflickr.com/800/600/portrait,person/all?lock=21
46	Hugo_Speed	hugo_speed@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Garaje siempre abierto.	https://loremflickr.com/800/600/portrait,person/all?lock=22
47	Alba_Speed	alba_speed@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Coleccionista de kilómetros y anécdotas.	https://loremflickr.com/800/600/portrait,person/all?lock=23
48	Lucia_Tuning	lucia_tuning@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Garaje siempre abierto.	https://loremflickr.com/800/600/portrait,person/all?lock=24
49	Sergio_JDM	sergio_jdm@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Apasionado de los motores desde siempre.	https://loremflickr.com/800/600/portrait,person/all?lock=25
50	Cristina_Motor	cristina_motor@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Si suena bien, va bien.	https://loremflickr.com/800/600/portrait,person/all?lock=26
51	Marc_Motor	marc_motor@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=27
52	Manuel_Rally	manuel_rally@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Los fines de semana son para la carretera.	https://loremflickr.com/800/600/portrait,person/all?lock=28
53	Alba_Rally	alba_rally@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=29
54	Irene_Rally	irene_rally@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Track days y café.	https://loremflickr.com/800/600/portrait,person/all?lock=30
55	Raul_Circuit	raul_circuit@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Restaurando clásicos en mi tiempo libre.	https://loremflickr.com/800/600/portrait,person/all?lock=31
56	Ivan_Classic	ivan_classic@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Restaurando clásicos en mi tiempo libre.	https://loremflickr.com/800/600/portrait,person/all?lock=32
57	Raul_Track	raul_track@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Restaurando clásicos en mi tiempo libre.	https://loremflickr.com/800/600/portrait,person/all?lock=33
58	Claudia_Turbo	claudia_turbo@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Track days y café.	https://loremflickr.com/800/600/portrait,person/all?lock=34
59	Irene_Track	irene_track@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=35
60	Adrian_Offroad	adrian_offroad@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Los fines de semana son para la carretera.	https://loremflickr.com/800/600/portrait,person/all?lock=36
61	Victor_Circuit	victor_circuit@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=37
62	Marta_Speed	marta_speed@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Coleccionista de kilómetros y anécdotas.	https://loremflickr.com/800/600/portrait,person/all?lock=38
63	Dani_Offroad	dani_offroad@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Restaurando clásicos en mi tiempo libre.	https://loremflickr.com/800/600/portrait,person/all?lock=39
64	Alba_Drift	alba_drift@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224		https://loremflickr.com/800/600/portrait,person/all?lock=40
65	Adrian_Track	adrian_track@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Track days y café.	https://loremflickr.com/800/600/portrait,person/all?lock=41
66	Marta_GT	marta_gt@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	JDM hasta la médula.	https://loremflickr.com/800/600/portrait,person/all?lock=42
67	Ines_Speed	ines_speed@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Track days y café.	https://loremflickr.com/800/600/portrait,person/all?lock=43
68	Elena_Speed	elena_speed@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Track days y café.	https://loremflickr.com/800/600/portrait,person/all?lock=44
69	Sofia_JDM	sofia_jdm@demo-motorsocial.com	$2b$10$ww6lMmrTEILhlkmeCtapROXwvBPMxMiVqIrH40rIweDFCI1/6j/AS	2026-08-22 15:12:26.394224	Coleccionista de kilómetros y anécdotas.	https://loremflickr.com/800/600/portrait,person/all?lock=45
\.


--
-- Name: _migraciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public._migraciones_id_seq', 2, true);


--
-- Name: coche_fotos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.coche_fotos_id_seq', 2, true);


--
-- Name: coches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.coches_id_seq', 112, true);


--
-- Name: comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.comentarios_id_seq', 280, true);


--
-- Name: notificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.notificaciones_id_seq', 1, false);


--
-- Name: publicacion_comentarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.publicacion_comentarios_id_seq', 156, true);


--
-- Name: publicaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.publicaciones_id_seq', 75, true);


--
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 69, true);


--
-- Name: _migraciones _migraciones_nombre_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._migraciones
    ADD CONSTRAINT _migraciones_nombre_key UNIQUE (nombre);


--
-- Name: _migraciones _migraciones_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public._migraciones
    ADD CONSTRAINT _migraciones_pkey PRIMARY KEY (id);


--
-- Name: coche_fotos coche_fotos_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coche_fotos
    ADD CONSTRAINT coche_fotos_pkey PRIMARY KEY (id);


--
-- Name: coches coches_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coches
    ADD CONSTRAINT coches_pkey PRIMARY KEY (id);


--
-- Name: comentarios comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_pkey PRIMARY KEY (id);


--
-- Name: me_gusta me_gusta_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.me_gusta
    ADD CONSTRAINT me_gusta_pkey PRIMARY KEY (usuario_id, coche_id);


--
-- Name: notificaciones notificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_pkey PRIMARY KEY (id);


--
-- Name: publicacion_comentarios publicacion_comentarios_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicacion_comentarios
    ADD CONSTRAINT publicacion_comentarios_pkey PRIMARY KEY (id);


--
-- Name: publicacion_likes publicacion_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicacion_likes
    ADD CONSTRAINT publicacion_likes_pkey PRIMARY KEY (usuario_id, publicacion_id);


--
-- Name: publicaciones publicaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_pkey PRIMARY KEY (id);


--
-- Name: seguidores seguidores_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.seguidores
    ADD CONSTRAINT seguidores_pkey PRIMARY KEY (seguidor_id, seguido_id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: coche_fotos coche_fotos_coche_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coche_fotos
    ADD CONSTRAINT coche_fotos_coche_id_fkey FOREIGN KEY (coche_id) REFERENCES public.coches(id) ON DELETE CASCADE;


--
-- Name: coches coches_propietario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.coches
    ADD CONSTRAINT coches_propietario_id_fkey FOREIGN KEY (propietario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: comentarios comentarios_coche_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_coche_id_fkey FOREIGN KEY (coche_id) REFERENCES public.coches(id) ON DELETE CASCADE;


--
-- Name: comentarios comentarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.comentarios
    ADD CONSTRAINT comentarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: me_gusta me_gusta_coche_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.me_gusta
    ADD CONSTRAINT me_gusta_coche_id_fkey FOREIGN KEY (coche_id) REFERENCES public.coches(id) ON DELETE CASCADE;


--
-- Name: me_gusta me_gusta_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.me_gusta
    ADD CONSTRAINT me_gusta_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: notificaciones notificaciones_actor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_actor_id_fkey FOREIGN KEY (actor_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: notificaciones notificaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.notificaciones
    ADD CONSTRAINT notificaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: publicacion_comentarios publicacion_comentarios_publicacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicacion_comentarios
    ADD CONSTRAINT publicacion_comentarios_publicacion_id_fkey FOREIGN KEY (publicacion_id) REFERENCES public.publicaciones(id) ON DELETE CASCADE;


--
-- Name: publicacion_comentarios publicacion_comentarios_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicacion_comentarios
    ADD CONSTRAINT publicacion_comentarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: publicacion_likes publicacion_likes_publicacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicacion_likes
    ADD CONSTRAINT publicacion_likes_publicacion_id_fkey FOREIGN KEY (publicacion_id) REFERENCES public.publicaciones(id) ON DELETE CASCADE;


--
-- Name: publicacion_likes publicacion_likes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicacion_likes
    ADD CONSTRAINT publicacion_likes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: publicaciones publicaciones_coche_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_coche_id_fkey FOREIGN KEY (coche_id) REFERENCES public.coches(id) ON DELETE SET NULL;


--
-- Name: publicaciones publicaciones_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.publicaciones
    ADD CONSTRAINT publicaciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: seguidores seguidores_seguido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.seguidores
    ADD CONSTRAINT seguidores_seguido_id_fkey FOREIGN KEY (seguido_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: seguidores seguidores_seguidor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.seguidores
    ADD CONSTRAINT seguidores_seguidor_id_fkey FOREIGN KEY (seguidor_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

-- Translate demo content loaded from the legacy Spanish data dump.
CREATE TEMP TABLE seed_translations (source_text text PRIMARY KEY, translated_text text NOT NULL);
INSERT INTO seed_translations (source_text, translated_text) VALUES
    ('Rojo', 'Red'), ('Negro', 'Black'), ('Blanco', 'White'), ('Azul', 'Blue'),
    ('Gris', 'Gray'), ('gris', 'Gray'), ('Amarillo', 'Yellow'), ('Verde', 'Green'),
    ('Naranja', 'Orange'), ('Plata', 'Silver'),
    ('Restaurado íntegramente en 2023.', 'Fully restored in 2023.'),
    ('Preparación ligera de escape y suspensión.', 'Mild exhaust and suspension upgrades.'),
    ('Icono del rally de Grupo B.', 'A Group B rally icon.'),
    ('Apasionado de los motores desde siempre.', 'A lifelong car enthusiast.'),
    ('Los fines de semana son para la carretera.', 'Weekends are for the open road.'),
    ('Restaurando clásicos en mi tiempo libre.', 'Restoring classics in my spare time.'),
    ('JDM hasta la médula.', 'JDM through and through.'),
    ('Track days y café.', 'Track days and coffee.'),
    ('Coleccionista de kilómetros y anécdotas.', 'Collecting miles and stories.'),
    ('Si suena bien, va bien.', 'If it sounds good, it drives good.'),
    ('Garaje siempre abierto.', 'Garage is always open.'),
    ('¡Qué pasada!', 'That is awesome!'), ('Menuda bestia 🔥', 'What a beast 🔥'),
    ('¿Cuántos caballos tiene?', 'How much horsepower?'), ('Me encanta el color', 'Love the color'),
    ('¡Brutal!', 'Absolutely brilliant!'), ('Quiero uno igual', 'I want one just like it'),
    ('¿Está en venta?', 'Is it for sale?'), ('Impresionante acabado', 'Incredible finish'),
    ('Se ve genial así', 'Looks great like that'), ('Enhorabuena por el trabajo', 'Great work on it'),
    ('Un clásico como pocos', 'A rare kind of classic'), ('Suena de maravilla seguro', 'Bet it sounds amazing'),
    ('Domingo de carretera con este compañero de viaje 🏁', 'Sunday drive with this travel companion 🏁'),
    ('Recién salido del taller, como nuevo.', 'Fresh out of the shop and running like new.'),
    ('Pulido de la mañana antes de la quedada de hoy.', 'A morning polish before today''s meetup.'),
    ('No hay nada como el sonido de este motor arrancando en frío.', 'Nothing beats the sound of this engine starting from cold.'),
    ('¿Alguien más para la quedada del sábado?', 'Anyone else coming to Saturday''s meetup?'),
    ('Últimos retoques antes de la ITV.', 'Final touches before inspection day.'),
    ('Cambié las llantas y quedó otro coche completamente distinto.', 'Changed the wheels and it feels like a completely different car.'),
    ('Un año más con él, y no me cansa.', 'Another year together, and I still love it.'),
    ('Ruta de montaña este finde, fotos random.', 'Mountain roads this weekend. A few snapshots.'),
    ('Pequeña puesta a punto para la temporada que viene.', 'A little tune-up for next season.'),
    ('Encontré este cartel vintage a juego con el coche, no pude resistirme.', 'Found this vintage sign to match the car. Couldn''t resist.'),
    ('Café + coches, la combinación perfecta de sábado por la mañana.', 'Coffee + cars: the perfect Saturday morning combo.'),
    ('Nueva incorporación al garaje, ya os cuento más.', 'A new addition to the garage. More soon.'),
    ('Repasando la mecánica antes del viaje largo del mes que viene.', 'Checking everything over before next month''s long drive.');

UPDATE public.coches AS cars
SET color = translations.translated_text
FROM pg_temp.seed_translations AS translations
WHERE cars.color = translations.source_text;

UPDATE public.coches AS cars
SET descripcion = translations.translated_text
FROM pg_temp.seed_translations AS translations
WHERE cars.descripcion = translations.source_text;

UPDATE public.comentarios AS comments
SET contenido = translations.translated_text
FROM pg_temp.seed_translations AS translations
WHERE comments.contenido = translations.source_text;

UPDATE public.publicacion_comentarios AS comments
SET contenido = translations.translated_text
FROM pg_temp.seed_translations AS translations
WHERE comments.contenido = translations.source_text;

UPDATE public.publicaciones AS posts
SET texto = translations.translated_text
FROM pg_temp.seed_translations AS translations
WHERE posts.texto = translations.source_text;

UPDATE public.usuarios AS users
SET nombre = 'Demo_Classics'
WHERE users.nombre = 'Demo_Clasicos';

UPDATE public.usuarios AS users
SET bio = translations.translated_text
FROM pg_temp.seed_translations AS translations
WHERE users.bio = translations.source_text;

DROP TABLE seed_translations;

\unrestrict gQikuFqhODyqnQ8rOWfR5aedUfFrl5LDwM6IUmnGgA6FtoYHW93akgKfhasS3Au


PGDMP  #    '            
    |         
   sched_zvq5    16.4 (Debian 16.4-1.pgdg120+2)    16.6 0    T           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            U           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            V           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            W           1262    16389 
   sched_zvq5    DATABASE     u   CREATE DATABASE sched_zvq5 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF8';
    DROP DATABASE sched_zvq5;
                sched_zvq5_user    false            X           0    0 
   sched_zvq5    DATABASE PROPERTIES     3   ALTER DATABASE sched_zvq5 SET "TimeZone" TO 'utc';
                     sched_zvq5_user    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                sched_zvq5_user    false            Y           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   sched_zvq5_user    false    5            �            1259    16457 	   dean_list    TABLE     L   CREATE TABLE public.dean_list (
    id_number character varying NOT NULL
);
    DROP TABLE public.dean_list;
       public         heap    sched_zvq5_user    false    5            �            1259    16440    facultytime    TABLE     �   CREATE TABLE public.facultytime (
    id character varying NOT NULL,
    timein text,
    timeout text,
    day character varying,
    indx integer NOT NULL
);
    DROP TABLE public.facultytime;
       public         heap    sched_zvq5_user    false    5            �            1259    16439    facultytime_indx_seq    SEQUENCE     �   CREATE SEQUENCE public.facultytime_indx_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.facultytime_indx_seq;
       public          sched_zvq5_user    false    224    5            Z           0    0    facultytime_indx_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.facultytime_indx_seq OWNED BY public.facultytime.indx;
          public          sched_zvq5_user    false    223            �            1259    16432    info    TABLE     �  CREATE TABLE public.info (
    id_number character varying NOT NULL,
    first character varying,
    mid character varying,
    last character varying,
    course character varying,
    civil_status text,
    password character varying,
    username character varying,
    gender character varying,
    year character varying,
    section character varying,
    birthday character varying,
    college character varying,
    email character varying
);
    DROP TABLE public.info;
       public         heap    sched_zvq5_user    false    5            �            1259    16426    notif    TABLE        CREATE TABLE public.notif (
    notif_id integer NOT NULL,
    sender_id character varying,
    receiver_id character varying,
    notif_text character varying,
    dateandtime character varying,
    status character varying,
    type character varying
);
    DROP TABLE public.notif;
       public         heap    sched_zvq5_user    false    5            �            1259    16425    notif_notif_id_seq    SEQUENCE     �   CREATE SEQUENCE public.notif_notif_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.notif_notif_id_seq;
       public          sched_zvq5_user    false    221    5            [           0    0    notif_notif_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.notif_notif_id_seq OWNED BY public.notif.notif_id;
          public          sched_zvq5_user    false    220            �            1259    16411    pool    TABLE     y   CREATE TABLE public.pool (
    voter_id character varying,
    voted_id character varying,
    vote character varying
);
    DROP TABLE public.pool;
       public         heap    sched_zvq5_user    false    5            �            1259    16417    record    TABLE     c  CREATE TABLE public.record (
    record_id integer NOT NULL,
    id_number character varying,
    exc_date character varying,
    type character varying,
    learner_id character varying,
    consulted_date character varying,
    consulted_time_in character varying,
    consulted_time_out character varying,
    consultation_purpose character varying
);
    DROP TABLE public.record;
       public         heap    sched_zvq5_user    false    5            �            1259    16416    record_record_id_seq    SEQUENCE     �   CREATE SEQUENCE public.record_record_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.record_record_id_seq;
       public          sched_zvq5_user    false    5    219            \           0    0    record_record_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.record_record_id_seq OWNED BY public.record.record_id;
          public          sched_zvq5_user    false    218            �            1259    16403    sched    TABLE       CREATE TABLE public.sched (
    sched_id integer NOT NULL,
    nagsched character varying,
    nasched character varying,
    time_in text,
    time_out text,
    date text,
    remark character varying,
    scheduler_role character varying,
    purpose character varying
);
    DROP TABLE public.sched;
       public         heap    sched_zvq5_user    false    5            �            1259    16402    sched_sched_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sched_sched_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.sched_sched_id_seq;
       public          sched_zvq5_user    false    5    216            ]           0    0    sched_sched_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.sched_sched_id_seq OWNED BY public.sched.sched_id;
          public          sched_zvq5_user    false    215            �            1259    16449    studenttime    TABLE     �   CREATE TABLE public.studenttime (
    indx integer NOT NULL,
    id character varying,
    timein text,
    timeout text,
    day character varying
);
    DROP TABLE public.studenttime;
       public         heap    sched_zvq5_user    false    5            �            1259    16448    studenttime_indx_seq    SEQUENCE     �   CREATE SEQUENCE public.studenttime_indx_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.studenttime_indx_seq;
       public          sched_zvq5_user    false    5    226            ^           0    0    studenttime_indx_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.studenttime_indx_seq OWNED BY public.studenttime.indx;
          public          sched_zvq5_user    false    225            �           2604    16443    facultytime indx    DEFAULT     t   ALTER TABLE ONLY public.facultytime ALTER COLUMN indx SET DEFAULT nextval('public.facultytime_indx_seq'::regclass);
 ?   ALTER TABLE public.facultytime ALTER COLUMN indx DROP DEFAULT;
       public          sched_zvq5_user    false    223    224    224            �           2604    16429    notif notif_id    DEFAULT     p   ALTER TABLE ONLY public.notif ALTER COLUMN notif_id SET DEFAULT nextval('public.notif_notif_id_seq'::regclass);
 =   ALTER TABLE public.notif ALTER COLUMN notif_id DROP DEFAULT;
       public          sched_zvq5_user    false    220    221    221            �           2604    16420    record record_id    DEFAULT     t   ALTER TABLE ONLY public.record ALTER COLUMN record_id SET DEFAULT nextval('public.record_record_id_seq'::regclass);
 ?   ALTER TABLE public.record ALTER COLUMN record_id DROP DEFAULT;
       public          sched_zvq5_user    false    218    219    219            �           2604    16406    sched sched_id    DEFAULT     p   ALTER TABLE ONLY public.sched ALTER COLUMN sched_id SET DEFAULT nextval('public.sched_sched_id_seq'::regclass);
 =   ALTER TABLE public.sched ALTER COLUMN sched_id DROP DEFAULT;
       public          sched_zvq5_user    false    216    215    216            �           2604    16452    studenttime indx    DEFAULT     t   ALTER TABLE ONLY public.studenttime ALTER COLUMN indx SET DEFAULT nextval('public.studenttime_indx_seq'::regclass);
 ?   ALTER TABLE public.studenttime ALTER COLUMN indx DROP DEFAULT;
       public          sched_zvq5_user    false    225    226    226            Q          0    16457 	   dean_list 
   TABLE DATA           .   COPY public.dean_list (id_number) FROM stdin;
    public          sched_zvq5_user    false    227   66       N          0    16440    facultytime 
   TABLE DATA           E   COPY public.facultytime (id, timein, timeout, day, indx) FROM stdin;
    public          sched_zvq5_user    false    224   _6       L          0    16432    info 
   TABLE DATA           �   COPY public.info (id_number, first, mid, last, course, civil_status, password, username, gender, year, section, birthday, college, email) FROM stdin;
    public          sched_zvq5_user    false    222   �6       K          0    16426    notif 
   TABLE DATA           h   COPY public.notif (notif_id, sender_id, receiver_id, notif_text, dateandtime, status, type) FROM stdin;
    public          sched_zvq5_user    false    221   m>       G          0    16411    pool 
   TABLE DATA           8   COPY public.pool (voter_id, voted_id, vote) FROM stdin;
    public          sched_zvq5_user    false    217   �C       I          0    16417    record 
   TABLE DATA           �   COPY public.record (record_id, id_number, exc_date, type, learner_id, consulted_date, consulted_time_in, consulted_time_out, consultation_purpose) FROM stdin;
    public          sched_zvq5_user    false    219   �C       F          0    16403    sched 
   TABLE DATA           v   COPY public.sched (sched_id, nagsched, nasched, time_in, time_out, date, remark, scheduler_role, purpose) FROM stdin;
    public          sched_zvq5_user    false    216   `E       P          0    16449    studenttime 
   TABLE DATA           E   COPY public.studenttime (indx, id, timein, timeout, day) FROM stdin;
    public          sched_zvq5_user    false    226   �F       _           0    0    facultytime_indx_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.facultytime_indx_seq', 21, true);
          public          sched_zvq5_user    false    223            `           0    0    notif_notif_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.notif_notif_id_seq', 61, true);
          public          sched_zvq5_user    false    220            a           0    0    record_record_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.record_record_id_seq', 38, true);
          public          sched_zvq5_user    false    218            b           0    0    sched_sched_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.sched_sched_id_seq', 24, true);
          public          sched_zvq5_user    false    215            c           0    0    studenttime_indx_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.studenttime_indx_seq', 21, true);
          public          sched_zvq5_user    false    225            �           2606    16447    facultytime facultytime_pk 
   CONSTRAINT     Z   ALTER TABLE ONLY public.facultytime
    ADD CONSTRAINT facultytime_pk PRIMARY KEY (indx);
 D   ALTER TABLE ONLY public.facultytime DROP CONSTRAINT facultytime_pk;
       public            sched_zvq5_user    false    224            �           2606    16438    info info_pk 
   CONSTRAINT     Q   ALTER TABLE ONLY public.info
    ADD CONSTRAINT info_pk PRIMARY KEY (id_number);
 6   ALTER TABLE ONLY public.info DROP CONSTRAINT info_pk;
       public            sched_zvq5_user    false    222            �           2606    16424    record record_pk 
   CONSTRAINT     U   ALTER TABLE ONLY public.record
    ADD CONSTRAINT record_pk PRIMARY KEY (record_id);
 :   ALTER TABLE ONLY public.record DROP CONSTRAINT record_pk;
       public            sched_zvq5_user    false    219            �           2606    16410    sched sched_pk 
   CONSTRAINT     R   ALTER TABLE ONLY public.sched
    ADD CONSTRAINT sched_pk PRIMARY KEY (sched_id);
 8   ALTER TABLE ONLY public.sched DROP CONSTRAINT sched_pk;
       public            sched_zvq5_user    false    216            �           2606    16456    studenttime studenttime_pk 
   CONSTRAINT     Z   ALTER TABLE ONLY public.studenttime
    ADD CONSTRAINT studenttime_pk PRIMARY KEY (indx);
 D   ALTER TABLE ONLY public.studenttime DROP CONSTRAINT studenttime_pk;
       public            sched_zvq5_user    false    226            Q      x�35162�24261����� m�      N   `   x�]���0�K1��Ԓ��H$�-E�b�%�T�r3��Xl֊7�bV�gpX�s^�
OV_l�8���B���9ƿ�!�x�ޖ;ҘUz."zÀ'      L   �  x���I�����ٿ��ي�̻�(8��T���$�j*$ʤ��o�euuUw��n�eHB>����6/@8U����EL�����$m%��"$���Ehk�dg����U�E�q�i��#���_�W\��)䖆�Ͻi�ٰLkn�Y{g����i���X_�cϱ��x���(�on y^bhmA<@Q��뗂��S��ׂ��>F$��$��bv��[J0�hHp�-)I��I���8���q!�l/Q��Ĭ��2"=b.�s<X���a�;ju;r3�h����Y@ �F���ڌ�Fq�\�A�k�"K"���"�+�d\�A���!��y���N|x��b;�Ԟ�XJ�ed�Q/�b]̈́B�W�C�+o��2����4`����|nݬ�]���(�J�(F����I��?�vHwI��$����&Q������ܡ_o���Ix�%c!I�Lt�{i5�T;��TTts���=����	aB�G�Ŷ �Y�x��C���>	��1!����p�$H%�(#ѷČ�.\-��T�~TNGb.�K!��Ъ0LD
�v���X�Lr'��Z1b�QK{^���9Md��Y�&����$�"B�do�c����{f&q�Zh?:�ͻz��"{��˶:�L�eר��%�4iS�G����d�
Pۂ�d��<�b�e�«<��g��(O	E�e�H��BI���hwU�p�^�Pq��m���ҝpD���O�yF/}�~nJe�h�7����O�p�GO�^m�}>Q�Y�' ,�&S��[�u.]&�diϬ�s-_��%�f���dd��(ވF�,�J�"q�ؼ���)����a	e�����^�:m٭]v���t��z/�4v���h�_n2ȝ����LNDN��ա��˕A9U_�l�f$�
�~u�[����_;�?u�g9�8]���>w�I��w=OMhD�>�#�.�k��W֮��+�t���0������;�hSP��: kc�!%Y��ٸk�qhDLts[�[�a��q��5�;3۳�n�X�Ӄ{	�#����s�����S�X3� ���'V�z����'#�8�D�(�)%VDRLq�5_�S6t�����O���
�m���^���.��D�h�y؛v�-��ȶn{�ǛL��	�]�8M+�J=�܆���1�~mJ@�!�P�@�BR�4�Ye���y�K�Ӳ��se `K��֧��Q-&�`<�t5�M�՝A��kGjJ;*��;�&|�����;�9�'���;sΣ�vm:�!��In7���I�:+^�溷�U�t�ygx�����X�����H`�S����(/�l��3b��٪�o)�B�O.�S���Z��F�Ӂ#����,���[�͉�y�̒=w��?���#(=���K����o�����CP �R]�J�,�MdT����u{�����W2��������1M���0�õy�#x�^&A$�E>8X��G���}��ރ~�r�4rp��s�����syo���7o�QzAh�b���uO]�k�Y�k6�x��C_���a��zl��(�ݪ6��K�F@c���?�˒��k��і��I�r�V43_J������*�$p�u��[w^I��G�e�ʱg�6oY���Ґ�e	����~��44�Yt���O�%�o���}�c7���}�S�\/��޸A�헸8�S�|�us���g
^X��g�o�ɧq+���}JB�1!4�>U��m�\��_��I)$Y�	��H��ɦ�Y|1;�ԝ�p=�}�D1��K�D����9�����U�M�8�"��\�҂�R~U��,�bۼ���D}'�'�����Q�npU�����/;��9�ϙ�����ԃ�Fe�a�W�/ƾ����CL������^�      K   Z  x��X�r�H]�_ѳ�CW�ڥ`(�"�o�j6B�8"��HrL�~n[J$�:�ʋ�����0]H�]\�9Z9_�79��/������6�w��uᚺE���Ѓ�7h��CF�xM�kFV�f�eRaN�+B2B�;,j�U7K6<��kB��C�R,�������b3ke��g�+j3)2&�%�1��}.nD�*v���������4#
S�'^���T�+�2�*
��\��[���-���:t��- ��Q�~�5Z������߻�� f�@��8):�����ãK}ALkKS1Q2��2.��ajϠ�P�5�Cb��Sbi�����B�]���qݩȤ	!26���n{�����s۶'�2�`A�tNG�>Ŗ�3�g���ekH��X;��gYs���3kH�h�rmW������4�1m<*j�����d�a�$������xM�`�Iʘ�(/
%T�Q)��R���Q(o]1e���%H�=)ƓN�_�����]�Z��7@&M�ys���.�<x��诛��p����?�>��ĵ��q��IJ�^���c�v�q��1X��+�~�ҩ`Mܹ�}��h��>nS�,�Q���3�òF�9�~W?NlFV�L��X�^Ds:�u����h�]����.R,(F@��j�&��F���/�ϸ� �$�J%�E�~� �D���"��,Oт��D/�5`�N&8&Z�F:�Q�ڀW!Gh
D4�%�H�RݒM��윱�\�:�C �T��k��I���I`G���{Ƒ�""1W2��X{?�� ��̙H:$.wh�]���c�Y�ASdns�Dt�$,�����,�m
���"�0Y��Ty������J1�Ur?�:�'�8P�D�cDr�quqDb,���w4a/�,?# n��'�3��7�DTg��f�R�����.Q�'�Pu��S��wۼs-��
�u�t��� �϶h!~�S
����G1;�޻�ƣ��~oѾ=��EyM&�&���+lY"��Y�+��Q��?:�����]�'��+X��T'�6��|u�yhr�17�M_w��:��?hZ����^��~�}��M}R�E��^��.F��MX[�֠FM>�XHo��u�^�������k��a��a�D�:��	�?�s��7�u���d���2��V�U[�����MU��k�WWt'�a��$��H9E�x����_��p߻�sp��A�W�ǈ�GL�j�$8*�Ia᩟FO7 ��\r�{��%�%F�nD������q�˛�6�Z� �;-���,�5Z�O�U�XJ��N�u<v������w*�=�����n?:��"g�$�%y�˟�����Qơ����<��Q�o�x#D�2�`L'��/���j�      G      x������ � �      I   \  x���=o�0���
��>lc{�ԱcD��B����8�Wm3��y��ޡЊ	�� ��y��tZm <�صMw�۝ , -.�[쯧@ŗ�[F?�V*g�v9�jN�1�m�i��?�~��B㉽0��
FZ�F D��*���~+��~�J�, 9���l����ydOFZT�8LS2�/�o,��jnWVyF��=�&ҥ��
$(�[�-c���$�07D�0�C?��SR&ac���1�\]���B�̉ ���ز�}ۼ��y̛�8���͏��3.��y[���`q[���a��vj��g����<�1U�R+OVBI�)\6W��:��>>�u)4_h���Y�}�t��      F   �  x���Mn�0���)� �g��d�˞ �8
jJ&�z���8��R�(��͛7Hb���#��s6~A�I� ���2���0UK>
Y$Ѫ��|b``.'LH�eUړ�(�*�-(�|�������9��79*}=�?�SO>��%1�B� JkS����r���'`�!�%�s�%�<i7�d|�0h1�t���Mڃ�-ܽc��v�y�[���:��k�� BB�:R���wJ��|�E$_���I��׃X�YG�� ��a<:��m�?��N�3�~�$�\'��u"�	.Zyw��a�ڧ���6�'�?�˵���m{�LT��4��Phl�R�2��K5���u�CJ3��#f��ҁ����u��㍝���R����Jo��_�h      P   j   x�e��� �o٥��Bg��sT[P� �Br 	�	|g����-��$��i��c���߯���i�zMU�c>A�F:�7����m��'�
i?Yt�Q�9��_/�     
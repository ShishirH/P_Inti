import json
import numpy as np
import glob
from flask import Flask, render_template, request, jsonify
import pandas as pd
import os
import datetime
import time
from sklearn.manifold import TSNE, Isomap, MDS, LocallyLinearEmbedding
from sklearn.metrics import silhouette_score, silhouette_samples, davies_bouldin_score, calinski_harabasz_score
from sklearn.cluster import KMeans, SpectralClustering, DBSCAN, AgglomerativeClustering
import matplotlib.pyplot as plt
import numpy as np
import matplotlib.cm as cm
from collections import Counter
import csv
import scipy.stats as stats
from numpy import inf
import random
import numpy as np, numpy.random
import statistics
import argparse
import pandas as pd
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC 
from sklearn.neighbors import KNeighborsClassifier
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split

from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score
from sklearn.metrics import log_loss
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from sklearn.metrics import roc_auc_score
from sklearn.metrics import confusion_matrix
import math

app = Flask(__name__)
@app.route("/")
@app.route("/index")
def index(): 
    return render_template('index.html')


if __name__ == "__main__":
    app.static_folder = 'static'
    app.run(host='0.0.0.0', port=5000, debug=True)

#!/usr/bin/python
import csv
import re
import numpy as np
import collections
import matplotlib.pyplot as plt


class Course:
    def __init__(self):
        datas = ["dr_6099_ay16-17.csv", "dr_6099_ay17-18.csv", "dr_6099_ay18-19.csv", "dr_6099_ay19-20.csv",
                 "dr_6099_ay20-21.csv"]
        self._score = collections.defaultdict(list)
        self._class_crn = collections.defaultdict(list)
        self.grade = {'A+':4.0, 'A':4.0, 'A-':3.7, 'B+':3.3, 'B':3.0, 'B-':2.7, 'C+':2.3, 'C':2.0, 'C-':1.7, 'D+':1.3, 'D':1.0, 'D-':0.7, 'F':0}
        for data in datas:
            #with open(data, encoding="utf8", errors='ignore') as infile:
            with open(data) as infile:
                reader = csv.reader(infile)
                next(reader)
                for line in reader:
                    [crn, subj, course, sect, term, units, grade, title, lname, fname, pname, enrolled, received] = line
                    crn_data = {(subj + course, title, lname + " " + fname, enrolled)}
                    grade_data = (grade, received)
                    self._score[term+crn].append(grade_data)
                    if len(self._class_crn[term+crn]) == 0:
                        self._class_crn[term+crn].append(crn_data)


    def plot_by_crn(self, target, year):
        letter = []
        letter_count = []
        if self.search_by_crn(target, year):
            (course, title, name, enrolled) = list(self._class_crn[year+target][0])[0]
            grade = self._score[year+target]
            for v in grade:
                letter_count.append(int(v[1]))
                letter.append(v[0])
            plt.title(course + " " + title)
            plt.bar(range(1, len(letter) + 1), letter_count, color='skyblue', align="center")
            plt.xticks(range(1, len(letter) + 1), letter)
            plt.xlabel(name)
            plt.show()
            plt.fig_to_html()
        else:
            print("No such search")


    def plot_by_prof(self, names, year):
        letter = []
        letter_count = []
        temp_result = self.search_by_prof(names, year)
        crn, score = self.select_for_duplicate(temp_result)
        grade = 0.0
        if crn != -1:
            for v in score:
                letter_count.append(int(v[1]))
                letter.append(v[0])
            (course, title, name, enrolled) = list(self._class_crn[crn][0])[0]
            print(course)
            plt.title(course + " " + title)
            plt.bar(range(1, len(letter) + 1), letter_count, color='skyblue', align="center")
            plt.xticks(range(1, len(letter) + 1), letter)
            plt.xlabel(name)
            plt.show()
            plt.fig_to_html()
        else:
            print("No such search")

    def plot_by_title(self, names, year):
        letter = []
        letter_count = []
        temp_result = self.search_by_title(names, year)
        crn, score = self.select_for_duplicate(temp_result)
        if crn != -1:
            for v in score:
                letter_count.append(int(v[1]))
                letter.append(v[0])
            (course, title, name, enrolled) = list(self._class_crn[crn][0])[0]
            print(course)
            plt.title(course + " " + title)
            plt.bar(range(1, len(letter) + 1), letter_count, color='skyblue', align="center")
            plt.xticks(range(1, len(letter) + 1), letter)
            plt.xlabel(name)
            plt.show()
            plt.fig_to_html()
        else:
            print("No such search")


    def search_by_crn(self, target, year):
        if year+target in self._class_crn:
            return True
        return False

    def search_by_prof(self, name, year):
        profs = []
        for k, v in self._class_crn.items():
            if year in k:
                if name in list(v[0])[0][2]:
                    profs.append(k)
        return profs

    def search_by_title(self, name, year):
        title = []
        for k, v in self._class_crn.items():
            if year in k:
                if name in list(v[0])[0][1]:
                    title.append(k)
        return title

    def select_for_duplicate(self, result):
        if len(result) > 1:
            print("It appears duplicates!")
            count = 0
            for i in result:
                count += 1
                (course, title, name, enrolled) = list(self._class_crn[i][0])[0]
                year = i[:6]
                crn = i[6:]
                print(
                    str(count)+". (" + str(year) + " " + str(crn) + ") " + name + ": " + title + " " + course)
            answer = input("Select which you would like to search(1-" + str(count) + "): ")
            return result[answer-1], sorted(self._score[result[answer-1]])
        elif len(result) == 1:
            return result[0], sorted(self._score[result[0]])
        return -1, -1


class_test = Course()
#class_test.plot_by_crn("44590", "201701")
#class_test.plot_by_prof("Frid Yelena", "202103")
class_test.plot_by_title("Y1 -- Connections", "201902")
